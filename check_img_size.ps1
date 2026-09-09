Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("screenshot_mobile_375.png")
Write-Host "Width: $($img.Width) Height: $($img.Height)"
$img.Dispose()
