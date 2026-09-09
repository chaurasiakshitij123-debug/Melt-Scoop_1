Add-Type -AssemblyName System.Drawing

function Build-Seamless-Cone {
    param(
        [string]$SrcPath,
        [string]$DstPath,
        [int]$BgMinR = 205,
        [int]$BgMinG = 170,
        [int]$BgMinB = 140,
        [double]$EdgeTolerance = 18.0,
        [int]$BlendStartY = 880,
        [int]$BlendEndY = 980
    )

    $src = [System.Drawing.Bitmap]::new($SrcPath)
    $w = $src.Width
    $h = $src.Height

    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bytes = [Math]::Abs($srcData.Stride) * $h
    $srcRgb = New-Object byte[] $bytes
    [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcRgb, 0, $bytes)
    $src.UnlockBits($srcData)

    $isBg = New-Object bool[] ($w * $h)
    $visited = New-Object bool[] ($w * $h)
    $queue = New-Object System.Collections.Generic.Queue[int]

    for ($x = 0; $x -lt $w; $x++) {
        $idxTop = $x; $pTop = $idxTop * 4
        if ($srcRgb[$pTop+2] -ge $BgMinR -and $srcRgb[$pTop+1] -ge $BgMinG -and $srcRgb[$pTop] -ge $BgMinB) {
            $isBg[$idxTop] = $true; $visited[$idxTop] = $true; $queue.Enqueue($idxTop)
        }
        if ($x -lt 340 -or $x -gt 680) {
            $idxBot = ($h - 1) * $w + $x; $pBot = $idxBot * 4
            if ($srcRgb[$pBot+2] -ge $BgMinR -and $srcRgb[$pBot+1] -ge $BgMinG -and $srcRgb[$pBot] -ge $BgMinB) {
                $isBg[$idxBot] = $true; $visited[$idxBot] = $true; $queue.Enqueue($idxBot)
            }
        }
    }

    for ($y = 0; $y -lt $h; $y++) {
        $idxL = $y * $w; $pL = $idxL * 4
        if ($srcRgb[$pL+2] -ge $BgMinR -and $srcRgb[$pL+1] -ge $BgMinG -and $srcRgb[$pL] -ge $BgMinB) {
            if (-not $visited[$idxL]) { $isBg[$idxL] = $true; $visited[$idxL] = $true; $queue.Enqueue($idxL) }
        }
        $idxR = $y * $w + ($w - 1); $pR = $idxR * 4
        if ($srcRgb[$pR+2] -ge $BgMinR -and $srcRgb[$pR+1] -ge $BgMinG -and $srcRgb[$pR] -ge $BgMinB) {
            if (-not $visited[$idxR]) { $isBg[$idxR] = $true; $visited[$idxR] = $true; $queue.Enqueue($idxR) }
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
            $nx = $cx + $dx[$d]; $ny = $cy + $dy[$d]
            if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                $nidx = $ny * $w + $nx
                if (-not $visited[$nidx]) {
                    $np = $nidx * 4
                    $nb = [double]$srcRgb[$np]; $ng = [double]$srcRgb[$np+1]; $nr = [double]$srcRgb[$np+2]

                    if ($nr -ge $BgMinR -and $ng -ge $BgMinG -and $nb -ge $BgMinB) {
                        $diff = [Math]::Sqrt(($nr - $cr)*($nr - $cr) + ($ng - $cg)*($ng - $cg) + ($nb - $cb)*($nb - $cb))
                        if ($diff -le $EdgeTolerance) {
                            $isBg[$nidx] = $true; $visited[$nidx] = $true; $queue.Enqueue($nidx)
                        }
                    }
                }
            }
        }
    }

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
                
                $alpha = if ($bgCount -gt 0) { [double](255 - ($bgCount * 45)) } else { 255.0 }
                
                if ($y -ge $BlendStartY) {
                    if ($y -ge $BlendEndY) {
                        $alpha = 0.0
                    } else {
                        $fade = 1.0 - [double]($y - $BlendStartY) / [double]($BlendEndY - $BlendStartY)
                        $alpha = $alpha * $fade
                    }
                }
                $isoRgb[$p+3] = [byte][Math]::Max(0, [Math]::Min(255, [int]$alpha))
            }
        }
    }
    [System.Runtime.InteropServices.Marshal]::Copy($isoRgb, 0, $isoData.Scan0, $bytes)
    $iso.UnlockBits($isoData)

    $targetW = 896
    $targetH = 1200
    $finalCanvas = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($finalCanvas)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    # Draw lower waffle cone and sharp tip from vanilla
    $vanRef = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
    $tipSrc = New-Object System.Drawing.Rectangle(240, 700, 416, 480)
    $tipDst = New-Object System.Drawing.Rectangle(240, 700, 416, 480)
    $g.DrawImage($vanRef, $tipDst, $tipSrc, [System.Drawing.GraphicsUnit]::Pixel)

    # Draw flavor scoops onto canvas
    $flavorW = 860
    $flavorH = 860
    $flavorX = [int](($targetW - $flavorW) / 2)
    $flavorY = 40
    $g.DrawImage($iso, $flavorX, $flavorY, $flavorW, $flavorH)

    $g.Dispose()
    $finalCanvas.Save($DstPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $vanRef.Dispose()
    $finalCanvas.Dispose()
    $iso.Dispose()
    $src.Dispose()

    Write-Output "Successfully built seamless cone: $DstPath"
}

Build-Seamless-Cone -SrcPath 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg' -DstPath 'assets\images\strawberry.png'
Build-Seamless-Cone -SrcPath 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\pistachio_icecream_1788972103376.jpg' -DstPath 'assets\images\pistachio.png'
Build-Seamless-Cone -SrcPath 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\mango_icecream_1788972124049.jpg' -DstPath 'assets\images\mango.png'
