Add-Type -AssemblyName System.Drawing

$van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
# For each x from 300 to 600, scan downwards from y=350 to find where waffle starts
# Waffle has: R - G > 35, G < 140, B < 90
Write-Output "Scanning waffle boundary:"
for ($x = 300; $x -le 600; $x += 25) {
    $rimY = 0
    for ($y = 350; $y -le 550; $y++) {
        $c = $van.GetPixel($x, $y)
        if ($c.A -gt 50 -and ($c.R - $c.G) -gt 35 -and $c.G -lt 140 -and $c.B -lt 90) {
            $rimY = $y
            break
        }
    }
    Write-Output "x=$x : RimY=$rimY"
}
$van.Dispose()
