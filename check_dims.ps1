Add-Type -AssemblyName System.Drawing

$straw = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg')
$pist = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\pistachio_icecream_1788972103376.jpg')
$mango = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\mango_icecream_1788972124049.jpg')
$van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')

Write-Output "Strawberry: $($straw.Width) x $($straw.Height)"
Write-Output "Pistachio: $($pist.Width) x $($pist.Height)"
Write-Output "Mango: $($mango.Width) x $($mango.Height)"
Write-Output "Vanilla: $($van.Width) x $($van.Height)"

$straw.Dispose()
$pist.Dispose()
$mango.Dispose()
$van.Dispose()
