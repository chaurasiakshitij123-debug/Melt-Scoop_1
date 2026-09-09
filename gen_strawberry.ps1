Add-Type -AssemblyName System.Drawing

function Segment-And-Extend-Cone {
    param(
        [string]$SrcPath,
        [string]$DstPath,
        [int]$BgMinR = 210,
        [int]$BgMinG = 175,
        [int]$BgMinB = 150,
        [double]$EdgeTolerance = 14.0
    )

    $src = [System.Drawing.Bitmap]::new($SrcPath)
    $w = $src.Width
    $h = $src.Height

    # 1. Lock bits for fast pixel access
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bytes = [Math]::Abs($srcData.Stride) * $h
    $srcRgb = New-Object byte[] $bytes
    [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcRgb, 0, $bytes)
    $src.UnlockBits($srcData)

    # 2. BFS from outer borders
    $isBg = New-Object bool[] ($w * $h)
    $visited = New-Object bool[] ($w * $h)
    $queue = New-Object System.Collections.Generic.Queue[int]

    for ($x = 0; $x -lt $w; $x++) {
        $idxTop = $x
        $pTop = $idxTop * 4
        if ($srcRgb[$pTop+2] -ge $BgMinR -and $srcRgb[$pTop+1] -ge $BgMinG -and $srcRgb[$pTop] -ge $BgMinB) {
            $isBg[$idxTop] = $true
            $visited[$idxTop] = $true
            $queue.Enqueue($idxTop)
        }

        # For bottom, background is to the left (x < 350) and right (x > 670)
        if ($x -lt 320 -or $x -gt 700) {
            $idxBot = ($h - 1) * $w + $x
            $pBot = $idxBot * 4
            if ($srcRgb[$pBot+2] -ge $BgMinR -and $srcRgb[$pBot+1] -ge $BgMinG -and $srcRgb[$pBot] -ge $BgMinB) {
                $isBg[$idxBot] = $true
                $visited[$idxBot] = $true
                $queue.Enqueue($idxBot)
            }
        }
    }

    for ($y = 0; $y -lt $h; $y++) {
        $idxL = $y * $w
        $pL = $idxL * 4
        if ($srcRgb[$pL+2] -ge $BgMinR -and $srcRgb[$pL+1] -ge $BgMinG -and $srcRgb[$pL] -ge $BgMinB) {
            if (-not $visited[$idxL]) {
                $isBg[$idxL] = $true
                $visited[$idxL] = $true
                $queue.Enqueue($idxL)
            }
        }
        $idxR = $y * $w + ($w - 1)
        $pR = $idxR * 4
        if ($srcRgb[$pR+2] -ge $BgMinR -and $srcRgb[$pR+1] -ge $BgMinG -and $srcRgb[$pR] -ge $BgMinB) {
            if (-not $visited[$idxR]) {
                $isBg[$idxR] = $true
                $visited[$idxR] = $true
                $queue.Enqueue($idxR)
            }
        }
    }

    $dx = @(1, -1, 0, 0)
    $dy = @(0, 0, 1, -1)

    while ($queue.Count -gt 0) {
        $cur = $queue.Dequeue()
        $cy = [int]($cur / $w)
        $cx = $cur % $w
        $cp = $cur * 4
        $cb = [double]$srcRgb[$cp]; $cg = [double]$srcRgb[$cp+1]; $cr = [double]$srcRgb[$cp+2]

        for ($d = 0; $d -lt 4; $d++) {
            $nx = $cx + $dx[$d]
            $ny = $cy + $dy[$d]

            if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                $nidx = $ny * $w + $nx
                if (-not $visited[$nidx]) {
                    $np = $nidx * 4
                    $nb = [double]$srcRgb[$np]; $ng = [double]$srcRgb[$np+1]; $nr = [double]$srcRgb[$np+2]

                    # Condition: must match background luminance and be close to neighbor background
                    if ($nr -ge $BgMinR -and $ng -ge $BgMinG -and $nb -ge $BgMinB) {
                        $diff = [Math]::Sqrt(($nr - $cr)*($nr - $cr) + ($ng - $cg)*($ng - $cg) + ($nb - $cb)*($nb - $cb))
                        if ($diff -le $EdgeTolerance) {
                            $isBg[$nidx] = $true
                            $visited[$nidx] = $true
                            $queue.Enqueue($nidx)
                        }
                    }
                }
            }
        }
    }

    # 3. Create isolated bitmap with feathered boundary
    $iso = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $isoData = $iso.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $isoRgb = New-Object byte[] $bytes

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $idx = $y * $w + $x
            $p = $idx * 4
            if ($isBg[$idx]) {
                $isoRgb[$p] = 0; $isoRgb[$p+1] = 0; $isoRgb[$p+2] = 0; $isoRgb[$p+3] = 0
            } else {
                # Feather near bg
                $bgCount = 0
                for ($d = 0; $d -lt 4; $d++) {
                    $nx = $x + $dx[$d]; $ny = $y + $dy[$d]
                    if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                        if ($isBg[$ny * $w + $nx]) { $bgCount++ }
                    }
                }
                $isoRgb[$p] = $srcRgb[$p]
                $isoRgb[$p+1] = $srcRgb[$p+1]
                $isoRgb[$p+2] = $srcRgb[$p+2]
                if ($bgCount -gt 0) {
                    $isoRgb[$p+3] = [byte](255 - ($bgCount * 50))
                } else {
                    $isoRgb[$p+3] = 255
                }
            }
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($isoRgb, 0, $isoData.Scan0, $bytes)
    $iso.UnlockBits($isoData)

    # 4. Now compose onto an 896 x 1200 canvas with the pointed cone tip
    $vanillaRef = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
    $finalCanvas = New-Object System.Drawing.Bitmap(896, 1200, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($finalCanvas)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    # Draw the vanilla waffle cone lower half (from y=800 to 1200) to provide the complete pointed tip
    $tipSrcRect = New-Object System.Drawing.Rectangle(240, 820, 416, 380)
    $tipDstRect = New-Object System.Drawing.Rectangle(240, 820, 416, 380)
    $g.DrawImage($vanillaRef, $tipDstRect, $tipSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

    # Draw the flavor isolated image (scale slightly so the waffle cone width at bottom matches the tip perfectly)
    # The waffle cone of strawberry is ~280px wide at y=1000.
    $flavorWidth = 840
    $flavorHeight = 840
    $flavorX = [int]((896 - $flavorWidth) / 2)
    $flavorY = 50
    $g.DrawImage($iso, $flavorX, $flavorY, $flavorWidth, $flavorHeight)

    $g.Dispose()
    $finalCanvas.Save($DstPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $finalCanvas.Dispose()
    $vanillaRef.Dispose()
    $iso.Dispose()
    $src.Dispose()

    Write-Output "Generated: $DstPath"
}

Segment-And-Extend-Cone -SrcPath 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg' -DstPath 'assets\images\strawberry.png'
