Add-Type -AssemblyName System.Drawing

function Build-Flavor-Cone {
    param(
        [string]$SrcPath,
        [string]$DstPath,
        [int]$ScoopCutY = 560,
        [int]$BgMinR = 210,
        [int]$BgMinG = 175,
        [int]$BgMinB = 140,
        [double]$EdgeTol = 20.0,
        [int]$ScoopW = 640,
        [int]$ScoopH = 460,
        [int]$ScoopY = 30,
        [int]$ConeOffsetY = 380
    )

    $van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
    $src = [System.Drawing.Bitmap]::new($SrcPath)
    $w = $src.Width
    $h = $src.Height
    $targetW = 896
    $targetH = 1200

    # 1. Lock bits of source
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bytes = [Math]::Abs($srcData.Stride) * $h
    $srcRgb = New-Object byte[] $bytes
    [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcRgb, 0, $bytes)
    $src.UnlockBits($srcData)

    # 2. BFS background on top portion (y < ScoopCutY)
    $isBg = New-Object bool[] ($w * $h)
    $queue = New-Object System.Collections.Generic.Queue[int]

    # Seed top border
    for ($x = 0; $x -lt $w; $x++) {
        $idx = $x; $p = $idx * 4
        if ($srcRgb[$p+2] -ge $BgMinR -and $srcRgb[$p+1] -ge $BgMinG) {
            $isBg[$idx] = $true; $queue.Enqueue($idx)
        }
    }
    # Seed left and right borders
    for ($y = 0; $y -lt $ScoopCutY; $y++) {
        $idxL = $y * $w; $pL = $idxL * 4
        if ($srcRgb[$pL+2] -ge $BgMinR -and $srcRgb[$pL+1] -ge $BgMinG) {
            if (-not $isBg[$idxL]) { $isBg[$idxL] = $true; $queue.Enqueue($idxL) }
        }
        $idxR = $y * $w + ($w - 1); $pR = $idxR * 4
        if ($srcRgb[$pR+2] -ge $BgMinR -and $srcRgb[$pR+1] -ge $BgMinG) {
            if (-not $isBg[$idxR]) { $isBg[$idxR] = $true; $queue.Enqueue($idxR) }
        }
    }

    $dx = @(1, -1, 0, 0); $dy = @(0, 0, 1, -1)
    while ($queue.Count -gt 0) {
        $cur = $queue.Dequeue()
        $cy = [int]($cur / $w); $cx = $cur % $w
        $cp = $cur * 4
        $cb = [double]$srcRgb[$cp]; $cg = [double]$srcRgb[$cp+1]; $cr = [double]$srcRgb[$cp+2]

        for ($d = 0; $d -lt 4; $d++) {
            $nx = $cx + $dx[$d]; $ny = $cy + $dy[$d]
            if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $ScoopCutY) {
                $nidx = $ny * $w + $nx
                if (-not $isBg[$nidx]) {
                    $np = $nidx * 4
                    $nb = [double]$srcRgb[$np]; $ng = [double]$srcRgb[$np+1]; $nr = [double]$srcRgb[$np+2]

                    if ($nr -ge ($BgMinR - 15) -and $ng -ge ($BgMinG - 15)) {
                        $diff = [Math]::Sqrt(($nr - $cr)*($nr - $cr) + ($ng - $cg)*($ng - $cg) + ($nb - $cb)*($nb - $cb))
                        if ($diff -le $EdgeTol) {
                            $isBg[$nidx] = $true; $queue.Enqueue($nidx)
                        }
                    }
                }
            }
        }
    }

    # 3. Create isolated scoop bitmap
    $scoopBmp = New-Object System.Drawing.Bitmap($w, $ScoopCutY, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $scoopRect = New-Object System.Drawing.Rectangle(0, 0, $w, $ScoopCutY)
    $scoopData = $scoopBmp.LockBits($scoopRect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $scoopBytes = [Math]::Abs($scoopData.Stride) * $ScoopCutY
    $scoopRgb = New-Object byte[] $scoopBytes

    for ($y = 0; $y -lt $ScoopCutY; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $idx = $y * $w + $x
            $p = $idx * 4

            # Cut off any background or outside bounding area
            if ($isBg[$idx] -or $x -lt 150 -or $x -gt ($w - 150)) {
                $scoopRgb[$p] = 0; $scoopRgb[$p+1] = 0; $scoopRgb[$p+2] = 0; $scoopRgb[$p+3] = 0
            } else {
                $bgNeighbors = 0
                for ($d = 0; $d -lt 4; $d++) {
                    $nx = $x + $dx[$d]; $ny = $y + $dy[$d]
                    if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $ScoopCutY) {
                        if ($isBg[$ny * $w + $nx]) { $bgNeighbors++ }
                    }
                }

                $scoopRgb[$p] = $srcRgb[$p]
                $scoopRgb[$p+1] = $srcRgb[$p+1]
                $scoopRgb[$p+2] = $srcRgb[$p+2]

                $alpha = 255.0 - ($bgNeighbors * 50.0)
                # Fade out smoothly at bottom of scoop
                $fadeStartY = $ScoopCutY - 90
                if ($y -ge $fadeStartY) {
                    $alpha = $alpha * (1.0 - [double]($y - $fadeStartY) / 90.0)
                }
                $scoopRgb[$p+3] = [byte][Math]::Max(0, [Math]::Min(255, [int]$alpha))
            }
        }
    }
    [System.Runtime.InteropServices.Marshal]::Copy($scoopRgb, 0, $scoopData.Scan0, $scoopBytes)
    $scoopBmp.UnlockBits($scoopData)

    # 4. Composite onto final canvas with vanilla cone
    $finalBmp = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($finalBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    # Draw base waffle cone from vanilla
    $coneSrc = New-Object System.Drawing.Rectangle(240, $ConeOffsetY, 416, (1200 - $ConeOffsetY))
    $coneDst = New-Object System.Drawing.Rectangle(240, $ConeOffsetY, 416, (1200 - $ConeOffsetY))
    $g.DrawImage($van, $coneDst, $coneSrc, [System.Drawing.GraphicsUnit]::Pixel)

    # Draw flavor scoops sitting in the waffle cone
    $scoopDstX = [int](($targetW - $ScoopW) / 2)
    $g.DrawImage($scoopBmp, $scoopDstX, $ScoopY, $ScoopW, $ScoopH)

    $g.Dispose()
    $finalBmp.Save($DstPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $finalBmp.Dispose()
    $scoopBmp.Dispose()
    $van.Dispose()
    $src.Dispose()

    Write-Output "Generated perfect cone: $DstPath"
}

# Strawberry
Build-Flavor-Cone -SrcPath 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg' -DstPath 'assets\images\strawberry.png' -ScoopCutY 560 -BgMinR 210 -BgMinG 170 -BgMinB 90 -EdgeTol 24.0 -ScoopW 640 -ScoopH 440 -ScoopY 35 -ConeOffsetY 390

# Pistachio
Build-Flavor-Cone -SrcPath 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\pistachio_icecream_1788972103376.jpg' -DstPath 'assets\images\pistachio.png' -ScoopCutY 550 -BgMinR 205 -BgMinG 180 -BgMinB 140 -EdgeTol 22.0 -ScoopW 620 -ScoopH 440 -ScoopY 35 -ConeOffsetY 390

# Mango
Build-Flavor-Cone -SrcPath 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\mango_icecream_1788972124049.jpg' -DstPath 'assets\images\mango.png' -ScoopCutY 540 -BgMinR 210 -BgMinG 175 -BgMinB 120 -EdgeTol 22.0 -ScoopW 590 -ScoopH 440 -ScoopY 40 -ConeOffsetY 400
