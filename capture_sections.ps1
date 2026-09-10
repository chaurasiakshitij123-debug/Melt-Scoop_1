$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$sections = @(
    @{ Name = "shop"; Selector = "#bestsellersSection" },
    @{ Name = "boxbuilder"; Selector = "#boxBuilderSection" },
    @{ Name = "story"; Selector = "#storySection" },
    @{ Name = "store"; Selector = "#storeSection" },
    @{ Name = "footer"; Selector = "#footerContact" }
)

foreach ($s in $sections) {
    $secName = $s.Name
    $sel = $s.Selector
    $html = @"
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a1a; display: flex; justify-content: center; align-items: flex-start; padding: 20px 0; }
    iframe { width: 375px; height: 812px; border: 2px solid #ff5e7e; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); overflow: hidden; background: #FFF9F2; }
  </style>
</head>
<body>
  <iframe id="testFrame" src="http://localhost:8080/index.html"></iframe>
  <script>
    var frame = document.getElementById('testFrame');
    frame.onload = function() {
      setTimeout(function() {
        var doc = frame.contentDocument;
        doc.querySelectorAll('.reveal-slide-up, .reveal-on-scroll').forEach(function(el) {
          el.classList.add('is-revealed');
        });
        var el = doc.querySelector('$sel');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 500);
    };
  </script>
</body>
</html>
"@
    $htmlFile = Join-Path $PSScriptRoot "preview_$secName.html"
    Set-Content $htmlFile $html -Encoding utf8
    $out = Join-Path $PSScriptRoot "test_mobile_$secName.png"

    $args = @(
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=600,900",
        "--virtual-time-budget=3000",
        "--screenshot=$out",
        "http://localhost:8080/preview_$secName.html"
    )

    Start-Process -FilePath $chrome -ArgumentList $args -PassThru -Wait -NoNewWindow
    Write-Host "Captured $secName -> $(Test-Path $out)"
    Remove-Item $htmlFile -ErrorAction SilentlyContinue
}
