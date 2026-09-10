$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$out = Join-Path $PSScriptRoot "screenshot_desktop_1440.png"

$args = @(
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1440,900",
    "--screenshot=$out",
    "http://localhost:8080/"
)

Start-Process -FilePath $chrome -ArgumentList $args -PassThru -Wait -NoNewWindow
Write-Host "Captured desktop -> $(Test-Path $out)"
