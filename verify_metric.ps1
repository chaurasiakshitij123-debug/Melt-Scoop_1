Add-Type -AssemblyName System.Drawing

$van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
# Check 10 points on waffle cone
Write-Output "Waffle points:"
foreach ($pt in @(@(460, 600), @(460, 700), @(460, 800), @(460, 1000), @(380, 580), @(540, 580))) {
    $c = $van.GetPixel($pt[0], $pt[1])
    Write-Output "($($pt[0]), $($pt[1])): B=$($c.B), R-B=$($c.R - $c.B)"
}

# Check 10 points on ice cream scoop
Write-Output "Scoop points:"
foreach ($pt in @(@(460, 200), @(460, 300), @(460, 400), @(460, 500), @(460, 530), @(380, 480), @(500, 520))) {
    $c = $van.GetPixel($pt[0], $pt[1])
    Write-Output "($($pt[0]), $($pt[1])): B=$($c.B), R-B=$($c.R - $c.B)"
}
$van.Dispose()
