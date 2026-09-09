$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$workDir = "C:\Users\ADMIN\.gemini\antigravity\scratch\velvet-scoops"

$viewports = @(
    @{ Name = "mobile_320"; Width = 320; Height = 640 },
    @{ Name = "mobile_375"; Width = 375; Height = 812 },
    @{ Name = "mobile_414"; Width = 414; Height = 896 },
    @{ Name = "tablet_768"; Width = 768; Height = 1024 },
    @{ Name = "desktop_1440"; Width = 1440; Height = 900 }
)

foreach ($vp in $viewports) {
    $outPng = Join-Path $workDir ("screenshot_" + $vp.Name + ".png")
    $args = @(
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=$($vp.Width),$($vp.Height)",
        "--screenshot=$outPng",
        "http://localhost:8080/"
    )
    Write-Host "Capturing $($vp.Name) ($($vp.Width)x$($vp.Height))..."
    $proc = Start-Process -FilePath $chrome -ArgumentList $args -PassThru -Wait -NoNewWindow
    if (Test-Path $outPng) {
        $size = (Get-Item $outPng).Length
        Write-Host "  Success: $outPng ($size bytes)"
    } else {
        Write-Host "  Failed to create $outPng"
    }
}
