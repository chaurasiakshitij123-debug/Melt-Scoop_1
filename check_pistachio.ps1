Add-Type -AssemblyName System.Drawing

$pist = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\pistachio_icecream_1788972103376.jpg')

Write-Output "Pistachio left edge slice at y=350:"
for ($x = 150; $x -le 400; $x += 25) {
    $c = $pist.GetPixel($x, 350)
    Write-Output "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$pist.Dispose()
