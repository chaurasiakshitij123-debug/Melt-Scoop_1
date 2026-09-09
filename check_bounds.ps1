Add-Type -AssemblyName System.Drawing

$v = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
Write-Output "Size: $($v.Width) x $($v.Height)"
Write-Output "(0,0): $($v.GetPixel(0,0))"
Write-Output "(100,100): $($v.GetPixel(100,100))"
Write-Output "(448,600): $($v.GetPixel(448,600))"
Write-Output "(448,1100): $($v.GetPixel(448,1100))"
$v.Dispose()
