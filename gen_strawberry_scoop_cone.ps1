Add-Type -AssemblyName System.Drawing

$van = [System.Drawing.Bitmap]::new('assets\images\vanilla.png')
$targetW = 896
$targetH = 1200

$strawSrc = [System.Drawing.Bitmap]::new('C:\Users\ADMIN\.gemini\antigravity\brain\9e5f5974-611b-4d1c-bb67-0888dcc30838\strawberry_icecream_1788972051158.jpg')

$strawRect = New-Object System.Drawing.Rectangle(0, 0, 1024, 1024)
$srcData = $strawSrc.LockBits($strawRect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bytes = [Math]::Abs($srcData.Stride) * 1024
$sRgb = New-Object byte[] $bytes
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $sRgb, 0, $bytes)
$strawSrc.UnlockBits($srcData)

# BFS background for top half
$isBg = New-Object bool[] (1024 * 1024)
$queue = New-Object System.Collections.Generic.Queue[int]

for ($x = 0; $x -lt 1024; $x++) {
    $idx = $x; $p = $idx * 4
    if ($sRgb[$p+2] -ge 215 -and $sRgb[$p+1] -ge 185) {
        $isBg[$idx] = $true; $queue.Enqueue($idx)
    }
}
for ($y = 0; $y -lt 600; $y++) {
    $idxL = $y * 1024; $pL = $idxL * 4
    if ($sRgb[$pL+2] -ge 215 -and $sRgb[$pL+1] -ge 185) {
        if (-not $isBg[$idxL]) { $isBg[$idxL] = $true; $queue.Enqueue($idxL) }
    }
    $idxR = $y * 1024 + 1023; $pR = $idxR * 4
    if ($sRgb[$pR+2] -ge 215 -and $sRgb[$pR+1] -ge 185) {
        if (-not $isBg[$idxR]) { $isBg[$idxR] = $true; $queue.Enqueue($idxR) }
    }
}

$dx = @(1, -1, 0, 0); $dy = @(0, 0, 1, -1)
while ($queue.Count -gt 0) {
    $cur = $queue.Dequeue()
    $cy = [int]($cur / 1024); $cx = $cur % 1024
    $cp = $cur * 4
    $cb = [double]$sRgb[$cp]; $cg = [double]$sRgb[$cp+1]; $cr = [double]$sRgb[$cp+2]

    for ($d = 0; $d -lt 4; $d++) {
        $nx = $cx + $dx[$d]; $ny = $cy + $dy[$d]
        if ($nx -ge 0 -and $nx -lt 1024 -and $ny -ge 0 -and $ny -lt 600) {
            $nidx = $ny * 1024 + $nx
            if (-not $isBg[$nidx]) {
                $np = $nidx * 4
                $nb = [double]$sRgb[$np]; $ng = [double]$sRgb[$np+1]; $nr = [double]$sRgb[$np+2]
                if ($nr -ge 210 -and $ng -ge 175) {
                    $diff = [Math]::Sqrt(($nr - $cr)*($nr - $cr) + ($ng - $cg)*($ng - $cg) + ($nb - $cb)*($nb - $cb))
                    if ($diff -le 24.0) {
                        $isBg[$nidx] = $true; $queue.Enqueue($nidx)
                    }
                }
            }
        }
    }
}

$scoopBmp = New-Object System.Drawing.Bitmap(1024, 600, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$scoopRect = New-Object System.Drawing.Rectangle(0, 0, 1024, 600)
$scoopData = $scoopBmp.LockBits($scoopRect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$scoopBytes = [Math]::Abs($scoopData.Stride) * 600
$scoopRgb = New-Object byte[] $scoopBytes

for ($y = 0; $y -lt 600; $y++) {
    for ($x = 0; $x -lt 1024; $x++) {
        $idx = $y * 1024 + $x
        $p = $idx * 4
        if ($isBg[$idx]) {
            $scoopRgb[$p] = 0; $scoopRgb[$p+1] = 0; $scoopRgb[$p+2] = 0; $scoopRgb[$p+3] = 0
        } else {
            $scoopRgb[$p] = $sRgb[$p]
            $scoopRgb[$p+1] = $sRgb[$p+1]
            $scoopRgb[$p+2] = $sRgb[$p+2]
            
            $alpha = 255.0
            if ($y -ge 470) {
                if ($y -ge 550) { $alpha = 0.0 }
                else { $alpha = 255.0 * (1.0 - [double]($y - 470) / 80.0) }
            }
            $scoopRgb[$p+3] = [byte][Math]::Max(0, [Math]::Min(255, [int]$alpha))
        }
    }
}
[System.Runtime.InteropServices.Marshal]::Copy($scoopRgb, 0, $scoopData.Scan0, $scoopBytes)
$scoopBmp.UnlockBits($scoopData)

$finalBmp = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($finalBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# 1. Draw base waffle cone from vanilla (starts at y=390 down to 1200)
$coneSrc = New-Object System.Drawing.Rectangle(240, 390, 416, 810)
$coneDst = New-Object System.Drawing.Rectangle(240, 390, 416, 810)
$g.DrawImage($van, $coneDst, $coneSrc, [System.Drawing.GraphicsUnit]::Pixel)

# 2. Draw strawberry scoops sitting inside the waffle cone
$scoopDstW = 620
$scoopDstH = 430
$scoopDstX = [int]((896 - $scoopDstW) / 2)
$scoopDstY = 50
$g.DrawImage($scoopBmp, $scoopDstX, $scoopDstY, $scoopDstW, $scoopDstH)

$g.Dispose()
$finalBmp.Save('assets\images\strawberry.png', [System.Drawing.Imaging.ImageFormat]::Png)

$finalBmp.Dispose()
$scoopBmp.Dispose()
$van.Dispose()
$strawSrc.Dispose()

Write-Output "Perfect strawberry cone generated"
