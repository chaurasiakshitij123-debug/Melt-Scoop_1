Add-Type -AssemblyName System.Drawing

$van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
Write-Output "Scanning center line (x=460):"
for ($y = 200; $y -le 560; $y += 20) {
    $c = $van.GetPixel(460, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$van.Dispose()
