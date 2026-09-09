Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("screenshot_mobile_375.png")

for ($x = 240; $x -lt 375; $x += 10) {
    $p = $img.GetPixel($x, 25)
    Write-Host "X=$x : R=$($p.R) G=$($p.G) B=$($p.B)"
}

$img.Dispose()
