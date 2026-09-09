Add-Type -AssemblyName System.Drawing

$s = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg')
Write-Output "Bottom row (y=1023):"
for ($x = 100; $x -le 900; $x += 100) {
    $c = $s.GetPixel($x, 1023)
    Write-Output "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}
$s.Dispose()
