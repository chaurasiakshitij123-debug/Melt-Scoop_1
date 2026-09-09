Add-Type -AssemblyName System.Drawing

$van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
Write-Output "Scanning lower (x=460):"
for ($y = 530; $y -le 650; $y += 10) {
    $c = $van.GetPixel(460, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$van.Dispose()
