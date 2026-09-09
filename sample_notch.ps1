Add-Type -AssemblyName System.Drawing

$van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
for ($y = 440; $y -le 540; $y += 10) {
    $c = $van.GetPixel(475, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$van.Dispose()
