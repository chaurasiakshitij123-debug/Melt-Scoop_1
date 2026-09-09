Add-Type -AssemblyName System.Drawing

$straw = [System.Drawing.Bitmap]::new('assets\images\strawberry.png')

for ($y = 600; $y -le 1100; $y += 50) {
    $minX = $straw.Width; $maxX = 0
    for ($x = 100; $x -lt $straw.Width - 100; $x++) {
        $c = $straw.GetPixel($x, $y)
        if ($c.A -gt 50) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
        }
    }
    if ($minX -lt $maxX) {
        Write-Output "Strawberry at y=${y}: X=[$minX, $maxX], Width=$($maxX - $minX), Center=$([int](($minX + $maxX)/2))"
    }
}
$straw.Dispose()
