Add-Type -AssemblyName System.Drawing

$v = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
Write-Output "Sampling bottom scoop in vanilla (x=500):"
for ($y = 380; $y -le 520; $y += 20) {
    $c = $v.GetPixel(500, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$v.Dispose()
