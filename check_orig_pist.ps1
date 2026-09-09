Add-Type -AssemblyName System.Drawing

$p = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\pistachio_icecream_1788972103376.jpg')
Write-Output "Original Pistachio (280, 320): $($p.GetPixel(280, 320))"
Write-Output "Original Pistachio (250, 350): $($p.GetPixel(250, 350))"
Write-Output "Original Pistachio (350, 350): $($p.GetPixel(350, 350))"
$p.Dispose()
