$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$html = @"
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a1a; display: flex; justify-content: center; align-items: flex-start; padding: 20px 0; }
    iframe { width: 320px; height: 600px; border: 2px solid #ff5e7e; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; background: #FFF9F2; }
  </style>
</head>
<body>
  <iframe src="http://localhost:8080/index.html"></iframe>
</body>
</html>
"@

Set-Content "preview_320.html" $html -Encoding utf8
$out = Join-Path $PSScriptRoot "test_iframe_320.png"

$args = @(
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=500,700",
    "--screenshot=$out",
    "http://localhost:8080/preview_320.html"
)

Start-Process -FilePath $chrome -ArgumentList $args -PassThru -Wait -NoNewWindow
Write-Host "Output at: $out. Exists: $(Test-Path $out)"
