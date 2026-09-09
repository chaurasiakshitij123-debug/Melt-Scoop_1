Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("screenshot_mobile_375.png")

Write-Host "Image size: $($img.Width) x $($img.Height)"

# Let's inspect row y = 25 (the header area)
# Find non-background pixels across row 25
$bg = $img.GetPixel(187, 25)
Write-Host "Header background color: $bg"

# Let's check where the pixels differ from bg
$firstX = -1
$lastX = -1
for ($x = 0; $x -lt $img.Width; $x++) {
    $p = $img.GetPixel($x, 25)
    if ($p.R -ne $bg.R -or $p.G -ne $bg.G -or $p.B -ne $bg.B) {
        if ($firstX -eq -1) { $firstX = $x }
        $lastX = $x
    }
}
Write-Host "Header content spans from X=$firstX to X=$lastX"

$img.Dispose()
