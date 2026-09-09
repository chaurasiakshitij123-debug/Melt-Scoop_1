Add-Type -AssemblyName System.Drawing

$srcPath = 'C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\vanilla_cone_isolated_1788981787882.jpg'
$dstPath = 'assets\images\vanilla.png'

$src = [System.Drawing.Bitmap]::new($srcPath)
$w = $src.Width
$h = $src.Height
$dst = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dstData = $dst.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = [Math]::Abs($srcData.Stride) * $h
$srcRgb = New-Object byte[] $bytes
$dstRgb = New-Object byte[] $bytes

[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcRgb, 0, $bytes)

for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = [int]$srcRgb[$i]
    $g = [int]$srcRgb[$i + 1]
    $r = [int]$srcRgb[$i + 2]
    
    $minVal = [Math]::Min($r, [Math]::Min($g, $b))
    $maxDiff = [Math]::Max([Math]::Abs($r - $g), [Math]::Max([Math]::Abs($r - $b), [Math]::Abs($g - $b)))
    
    if ($minVal -ge 245 -and $maxDiff -le 10) {
        $dstRgb[$i] = 0
        $dstRgb[$i + 1] = 0
        $dstRgb[$i + 2] = 0
        $dstRgb[$i + 3] = 0
    } elseif ($minVal -ge 230 -and $maxDiff -le 16) {
        $alpha = [int](((245 - $minVal) / 15.0) * 255)
        $dstRgb[$i] = [byte]$b
        $dstRgb[$i + 1] = [byte]$g
        $dstRgb[$i + 2] = [byte]$r
        $dstRgb[$i + 3] = [byte]$alpha
    } else {
        $dstRgb[$i] = [byte]$b
        $dstRgb[$i + 1] = [byte]$g
        $dstRgb[$i + 2] = [byte]$r
        $dstRgb[$i + 3] = 255
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($dstRgb, 0, $dstData.Scan0, $bytes)
$src.UnlockBits($srcData)
$dst.UnlockBits($dstData)

$dst.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$dst.Dispose()

Write-Output "Vanilla transparent PNG saved: $dstPath ($w x $h)"
