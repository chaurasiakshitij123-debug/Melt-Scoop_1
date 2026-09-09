Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\vanilla_cone_isolated_1788981787882.jpg')
Write-Output "Corner (0,0): $($src.GetPixel(0,0))"
Write-Output "Top-center (448, 10): $($src.GetPixel(448, 10))"
Write-Output "Near scoop (300, 150): $($src.GetPixel(300, 150))"
Write-Output "Scoop center (448, 200): $($src.GetPixel(448, 200))"
Write-Output "Scoop dark fold (448, 320): $($src.GetPixel(448, 320))"
Write-Output "Waffle cone (448, 700): $($src.GetPixel(448, 700))"
Write-Output "Waffle cone tip (448, 1140): $($src.GetPixel(448, 1140))"
Write-Output "Under cone tip (448, 1170): $($src.GetPixel(448, 1170))"
$src.Dispose()
