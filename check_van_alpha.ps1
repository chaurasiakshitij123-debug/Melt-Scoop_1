Add-Type -AssemblyName System.Drawing

$v = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
for ($x = 240; $x -le 350; $x += 20) {
    $c = $v.GetPixel($x, 700)
    Write-Output "Vanilla at ($x, 700): A=$($c.A), R=$($c.R), G=$($c.G), B=$($c.B)"
}
$v.Dispose()
