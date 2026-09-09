Add-Type -AssemblyName System.Drawing

$straw = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg')
$van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')

$sMinX = 1024; $sMaxX = 0
for ($x = 200; $x -lt 800; $x++) {
    $c = $straw.GetPixel($x, 950)
    if (($c.R - $c.B) -gt 40) {
        if ($x -lt $sMinX) { $sMinX = $x }
        if ($x -gt $sMaxX) { $sMaxX = $x }
    }
}
Write-Output "Strawberry cone at y=950: X=[$sMinX, $sMaxX], Width=$($sMaxX - $sMinX)"

for ($y = 700; $y -le 1100; $y += 50) {
    $vMinX = 896; $vMaxX = 0
    for ($x = 100; $x -lt 800; $x++) {
        $c = $van.GetPixel($x, $y)
        if ($c.A -gt 50 -and ($c.R - $c.B) -gt 30) {
            if ($x -lt $vMinX) { $vMinX = $x }
            if ($x -gt $vMaxX) { $vMaxX = $x }
        }
    }
    Write-Output "Vanilla cone at y=${y}: X=[$vMinX, $vMaxX], Width=$($vMaxX - $vMinX)"
}

$straw.Dispose()
$van.Dispose()
