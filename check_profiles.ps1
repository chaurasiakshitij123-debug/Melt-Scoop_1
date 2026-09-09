Add-Type -AssemblyName System.Drawing

function Check-Flavor-Profile {
    param([string]$name, [string]$path)
    $bmp = [System.Drawing.Bitmap]::new($path)
    Write-Output "--- $name ($($bmp.Width) x $($bmp.Height)) ---"
    Write-Output "Top-center (512, 50): $($bmp.GetPixel(512, 50))"
    Write-Output "Scoop top (512, 100): $($bmp.GetPixel(512, 100))"
    Write-Output "Scoop mid (512, 350): $($bmp.GetPixel(512, 350))"
    Write-Output "Rim/cone (512, 550): $($bmp.GetPixel(512, 550))"
    Write-Output "Cone lower (512, 900): $($bmp.GetPixel(512, 900))"
    Write-Output "Cone bottom (512, 1020): $($bmp.GetPixel(512, 1020))"
    Write-Output "Bottom-left (50, 950): $($bmp.GetPixel(50, 950))"
    $bmp.Dispose()
}

Check-Flavor-Profile "Strawberry" 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg'
Check-Flavor-Profile "Pistachio" 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\pistachio_icecream_1788972103376.jpg'
Check-Flavor-Profile "Mango" 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\mango_icecream_1788972124049.jpg'
