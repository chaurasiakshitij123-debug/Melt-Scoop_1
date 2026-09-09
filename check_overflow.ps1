$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$testScript = @'
(() => {
  const elements = document.querySelectorAll('*');
  const overflowing = [];
  const winW = window.innerWidth;
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.right > winW + 2) {
      overflowing.push({
        tag: el.tagName,
        id: el.id,
        cls: (typeof el.className === 'string' ? el.className.split(' ')[0] : ''),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        winW: winW
      });
    }
  });
  const summary = overflowing.map(o => `${o.tag}#${o.id}.${o.cls}(w:${o.width},r:${o.right})`).join(' | ');
  document.title = "RESULT: " + summary;
})();
'@

$content = Get-Content "index.html" -Raw
$injected = $content -replace "</body>", "<script>$testScript</script></body>"
Set-Content "test_overflow.html" $injected

$dom = & $chrome --headless --disable-gpu --window-size=375,812 --dump-dom http://localhost:8080/test_overflow.html
if ($dom -match "<title>RESULT: (.*?)</title>") {
    Write-Host "Found Overflowing elements at 375px:"
    $matches[1] -split ' \| ' | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "No overflow found or title didn't match."
}

Remove-Item "test_overflow.html" -ErrorAction SilentlyContinue

