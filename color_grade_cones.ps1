Add-Type -AssemblyName System.Drawing

function Create-Flavor-Cone {
    param(
        [string]$Flavor,
        [string]$DstPath
    )

    $van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
    $w = $van.Width
    $h = $van.Height

    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $srcData = $van.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $dst = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $dstData = $dst.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $bytes = [Math]::Abs($srcData.Stride) * $h
    $rgb = New-Object byte[] $bytes
    [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $rgb, 0, $bytes)
    $van.UnlockBits($srcData)

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = ($y * $w + $x) * 4
            $a = [int]$rgb[$p+3]
            if ($a -eq 0) { continue }

            $b = [double]$rgb[$p]
            $g = [double]$rgb[$p+1]
            $r = [double]$rgb[$p+2]

            # Calculate relative luminance / brightness
            $lum = (0.299 * $r + 0.587 * $g + 0.114 * $b) / 255.0

            # Flawless physical ice cream vs waffle classification:
            # Waffle cone has low blue (B <= 72) and high red-blue contrast (R-B >= 68).
            # Ice cream scoop is light cream/pastel: B > 72 and R-B < 68 down to y=555.
            $isScoop = ($y -lt 360) -or (($y -lt 555) -and ($b -gt 72) -and (($r - $b) -lt 68))

            if ($isScoop) {
                $tR = $r; $tG = $g; $tB = $b

                if ($Flavor -eq 'strawberry') {
                    if ($lum -gt 0.8) {
                        $tR = 255
                        $tG = 175 + ($lum - 0.8) * 350
                        $tB = 195 + ($lum - 0.8) * 280
                    } elseif ($lum -gt 0.5) {
                        $f = ($lum - 0.5) / 0.3
                        $tR = 234 + $f * 21
                        $tG = 115 + $f * 60
                        $tB = 142 + $f * 53
                    } else {
                        $f = $lum / 0.5
                        $tR = 160 + $f * 74
                        $tG = 32 + $f * 83
                        $tB = 52 + $f * 90
                    }
                } elseif ($Flavor -eq 'pistachio') {
                    if ($lum -gt 0.8) {
                        $tR = 195 + ($lum - 0.8) * 250
                        $tG = 225 + ($lum - 0.8) * 150
                        $tB = 160 + ($lum - 0.8) * 250
                    } elseif ($lum -gt 0.5) {
                        $f = ($lum - 0.5) / 0.3
                        $tR = 148 + $f * 47
                        $tG = 188 + $f * 37
                        $tB = 105 + $f * 55
                    } else {
                        $f = $lum / 0.5
                        $tR = 90 + $f * 58
                        $tG = 125 + $f * 63
                        $tB = 48 + $f * 57
                    }
                } elseif ($Flavor -eq 'mango') {
                    if ($lum -gt 0.8) {
                        $tR = 255
                        $tG = 205 + ($lum - 0.8) * 220
                        $tB = 50 + ($lum - 0.8) * 450
                    } elseif ($lum -gt 0.5) {
                        $f = ($lum - 0.5) / 0.3
                        $tR = 246 + $f * 9
                        $tG = 160 + $f * 45
                        $tB = 20 + $f * 30
                    } else {
                        $f = $lum / 0.5
                        $tR = 195 + $f * 51
                        $tG = 100 + $f * 60
                        $tB = 8 + $f * 12
                    }
                }

                $rgb[$p]   = [byte][Math]::Max(0, [Math]::Min(255, [int]$tB))
                $rgb[$p+1] = [byte][Math]::Max(0, [Math]::Min(255, [int]$tG))
                $rgb[$p+2] = [byte][Math]::Max(0, [Math]::Min(255, [int]$tR))
            }
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($rgb, 0, $dstData.Scan0, $bytes)
    $dst.UnlockBits($dstData)

    $dst.Save($DstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dst.Dispose()
    $van.Dispose()

    Write-Output "Perfected $Flavor -> $DstPath"
}

Create-Flavor-Cone -Flavor 'strawberry' -DstPath 'assets\images\strawberry.png'
Create-Flavor-Cone -Flavor 'pistachio'  -DstPath 'assets\images\pistachio.png'
Create-Flavor-Cone -Flavor 'mango'      -DstPath 'assets\images\mango.png'
