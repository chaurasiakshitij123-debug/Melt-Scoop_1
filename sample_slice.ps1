Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg')
$w = $src.Width
$h = $src.Height

# Sample horizontal slice across middle of top scoop (y = 250)
Write-Output "Horizontal slice at y=250:"
for ($x = 100; $x -le 900; $x += 100) {
    $c = $src.GetPixel($x, 250)
    Write-Output "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

# Sample horizontal slice across lower cone (y = 800)
Write-Output "Horizontal slice at y=800:"
for ($x = 200; $x -le 800; $x += 100) {
    $c = $src.GetPixel($x, 800)
    Write-Output "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$src.Dispose()
