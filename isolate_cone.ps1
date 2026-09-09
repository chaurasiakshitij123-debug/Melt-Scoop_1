Add-Type -AssemblyName System.Drawing

function Isolate-ProductCone {
    param(
        [string]$SrcPath,
        [string]$DstPath,
        [int]$BrightnessThreshold = 220,
        [int]$MaxChannelDiff = 12
    )

    $src = [System.Drawing.Bitmap]::new($SrcPath)
    $w = $src.Width
    $h = $src.Height
    $dst = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $dstData = $dst.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $bytes = [Math]::Abs($srcData.Stride) * $h
    $srcRgb = New-Object byte[] $bytes
    $dstRgb = New-Object byte[] $bytes

    [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcRgb, 0, $bytes)

    # 1. Connected-component BFS mask from edges
    $isBg = New-Object bool[] ($w * $h)
    $queue = New-Object System.Collections.Generic.Queue[int]

    # Helper function to test if pixel (x,y) looks like background
    # Index in byte array: (y * w + x) * 4
    for ($x = 0; $x -lt $w; $x++) {
        # top row
        $idx = $x
        $p = $idx * 4
        $b = [int]$srcRgb[$p]; $g = [int]$srcRgb[$p+1]; $r = [int]$srcRgb[$p+2]
        $minV = [Math]::Min($r, [Math]::Min($g, $b))
        $maxD = [Math]::Max([Math]::Abs($r - $g), [Math]::Max([Math]::Abs($r - $b), [Math]::Abs($g - $b)))
        if ($minV -ge $BrightnessThreshold -and $maxD -le $MaxChannelDiff) {
            $isBg[$idx] = $true
            $queue.Enqueue($idx)
        }
        # bottom row
        $idx = ($h - 1) * $w + $x
        $p = $idx * 4
        $b = [int]$srcRgb[$p]; $g = [int]$srcRgb[$p+1]; $r = [int]$srcRgb[$p+2]
        $minV = [Math]::Min($r, [Math]::Min($g, $b))
        $maxD = [Math]::Max([Math]::Abs($r - $g), [Math]::Max([Math]::Abs($r - $b), [Math]::Abs($g - $b)))
        if ($minV -ge $BrightnessThreshold -and $maxD -le $MaxChannelDiff) {
            $isBg[$idx] = $true
            $queue.Enqueue($idx)
        }
    }

    for ($y = 0; $y -lt $h; $y++) {
        # left column
        $idx = $y * $w
        $p = $idx * 4
        $b = [int]$srcRgb[$p]; $g = [int]$srcRgb[$p+1]; $r = [int]$srcRgb[$p+2]
        $minV = [Math]::Min($r, [Math]::Min($g, $b))
        $maxD = [Math]::Max([Math]::Abs($r - $g), [Math]::Max([Math]::Abs($r - $b), [Math]::Abs($g - $b)))
        if ($minV -ge $BrightnessThreshold -and $maxD -le $MaxChannelDiff) {
            if (-not $isBg[$idx]) {
                $isBg[$idx] = $true
                $queue.Enqueue($idx)
            }
        }
        # right column
        $idx = $y * $w + ($w - 1)
        $p = $idx * 4
        $b = [int]$srcRgb[$p]; $g = [int]$srcRgb[$p+1]; $r = [int]$srcRgb[$p+2]
        $minV = [Math]::Min($r, [Math]::Min($g, $b))
        $maxD = [Math]::Max([Math]::Abs($r - $g), [Math]::Max([Math]::Abs($r - $b), [Math]::Abs($g - $b)))
        if ($minV -ge $BrightnessThreshold -and $maxD -le $MaxChannelDiff) {
            if (-not $isBg[$idx]) {
                $isBg[$idx] = $true
                $queue.Enqueue($idx)
            }
        }
    }

    # BFS expansion
    $dx = @(1, -1, 0, 0)
    $dy = @(0, 0, 1, -1)

    while ($queue.Count -gt 0) {
        $cur = $queue.Dequeue()
        $cy = [int]($cur / $w)
        $cx = $cur % $w

        for ($d = 0; $d -lt 4; $d++) {
            $nx = $cx + $dx[$d]
            $ny = $cy + $dy[$d]

            if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                $nidx = $ny * $w + $nx
                if (-not $isBg[$nidx]) {
                    $p = $nidx * 4
                    $b = [int]$srcRgb[$p]; $g = [int]$srcRgb[$p+1]; $r = [int]$srcRgb[$p+2]
                    $minV = [Math]::Min($r, [Math]::Min($g, $b))
                    $maxD = [Math]::Max([Math]::Abs($r - $g), [Math]::Max([Math]::Abs($r - $b), [Math]::Abs($g - $b)))

                    if ($minV -ge $BrightnessThreshold -and $maxD -le $MaxChannelDiff) {
                        $isBg[$nidx] = $true
                        $queue.Enqueue($nidx)
                    }
                }
            }
        }
    }

    # 2. Render destination pixels with anti-aliasing feathering
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $idx = $y * $w + $x
            $p = $idx * 4
            $b = $srcRgb[$p]; $g = $srcRgb[$p+1]; $r = $srcRgb[$p+2]

            if ($isBg[$idx]) {
                # Transparent
                $dstRgb[$p] = 0
                $dstRgb[$p+1] = 0
                $dstRgb[$p+2] = 0
                $dstRgb[$p+3] = 0
            } else {
                # Check neighbors to feather border
                $bgNeighbors = 0
                for ($d = 0; $d -lt 4; $d++) {
                    $nx = $x + $dx[$d]
                    $ny = $y + $dy[$d]
                    if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
                        if ($isBg[$ny * $w + $nx]) { $bgNeighbors++ }
                    }
                }

                if ($bgNeighbors -gt 0) {
                    $alpha = [byte](255 - ($bgNeighbors * 45))
                    $dstRgb[$p] = $b
                    $dstRgb[$p+1] = $g
                    $dstRgb[$p+2] = $r
                    $dstRgb[$p+3] = $alpha
                } else {
                    $dstRgb[$p] = $b
                    $dstRgb[$p+1] = $g
                    $dstRgb[$p+2] = $r
                    $dstRgb[$p+3] = 255
                }
            }
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($dstRgb, 0, $dstData.Scan0, $bytes)
    $src.UnlockBits($srcData)
    $dst.UnlockBits($dstData)

    $dst.Save($DstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $src.Dispose()
    $dst.Dispose()

    Write-Output "Successfully isolated to $DstPath"
}

Isolate-ProductCone -SrcPath 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\vanilla_cone_isolated_1788981787882.jpg' -DstPath 'assets\images\vanilla.png' -BrightnessThreshold 215 -MaxChannelDiff 14
