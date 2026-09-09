Add-Type -AssemblyName System.Drawing

$v = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
Write-Output "Sampling lower section in vanilla (x=500):"
for ($y = 500; $y -le 700; $y += 25) {
    $c = $v.GetPixel(500, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$v.Dispose()
