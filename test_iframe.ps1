$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$out = Join-Path $PSScriptRoot "test_iframe_375.png"

$args = @(
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=600,900",
    "--screenshot=$out",
    "http://localhost:8080/preview_375.html"
)

Start-Process -FilePath $chrome -ArgumentList $args -PassThru -Wait -NoNewWindow
Write-Host "Output at: $out. Exists: $(Test-Path $out)"
