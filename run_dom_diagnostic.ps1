$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8081/")
$listener.Start()

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$diagHtml = @"
<!DOCTYPE html>
<html>
<body>
<iframe src="http://localhost:8080/" style="width:375px;height:812px;border:none;"></iframe>
<script>
window.addEventListener('message', (e) => {});
setTimeout(() => {
  const iframe = document.querySelector('iframe');
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  const win = iframe.contentWindow;
  const winW = win.innerWidth;
  const docW = doc.documentElement.scrollWidth;
  const bodyW = doc.body.scrollWidth;
  
  const overs = [];
  doc.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > winW + 1) {
      const id = el.id ? '#' + el.id : '';
      const cls = el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '';
      overs.push(`${el.tagName}${id}${cls}(r:${Math.round(r.right)},w:${Math.round(r.width)})`);
    }
  });
  
  const msg = `W:${winW} DocW:${docW} BodyW:${bodyW} | Overs: ` + overs.slice(0, 15).join(', ');
  fetch('http://localhost:8081/?res=' + encodeURIComponent(msg));
}, 1000);
</script>
</body>
</html>
"@

Set-Content "diag_iframe.html" $diagHtml

$proc = Start-Process $chrome -ArgumentList @("--headless", "--disable-gpu", "--window-size=600,900", "http://localhost:8080/diag_iframe.html") -PassThru

$ctx = $listener.GetContext()
$res = $ctx.Request.QueryString["res"]
Write-Host "DIAGNOSTIC RESULT:" -ForegroundColor Green
Write-Host $res -ForegroundColor Yellow

$resp = $ctx.Response
$resp.StatusCode = 200
$resp.Close()
$listener.Stop()

$proc | Stop-Process -Force -ErrorAction SilentlyContinue
Remove-Item "diag_iframe.html" -ErrorAction SilentlyContinue
