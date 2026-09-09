Add-Type -AssemblyName System.Drawing

# 1. Load source images
$strawSrc = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg')
$vanillaRef = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')

$w = 896
$h = 1200
$canvas = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# First, draw the reference cone tip from vanilla (from y=750 to 1200) onto the canvas
$srcTipRect = New-Object System.Drawing.Rectangle(200, 750, 496, 450)
$dstTipRect = New-Object System.Drawing.Rectangle(200, 750, 496, 450)
$g.DrawImage($vanillaRef, $dstTipRect, $srcTipRect, [System.Drawing.GraphicsUnit]::Pixel)

# Next, draw strawberry scoops and upper waffle cone (scale from 1024x1024 down to width 820, centered)
# We want scoops to start around y=60, and cone to overlap vanilla cone at y=750-850
$strawWidth = 820
$strawHeight = 820
$strawX = [int](($w - $strawWidth) / 2)
$strawY = 60

# We create an intermediate bitmap for strawberry with background removed
$g.Dispose()
$vanillaRef.Dispose()
$strawSrc.Dispose()
$canvas.Dispose()

Write-Output "Test script initialized"
