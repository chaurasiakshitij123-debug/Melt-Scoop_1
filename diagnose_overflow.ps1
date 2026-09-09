$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$script = @'
<script>
(() => {
  const winW = window.innerWidth;
  const bodyW = document.body.scrollWidth;
  const docW = document.documentElement.scrollWidth;
  
  let result = `WIN: ${winW}px, BODY_SCROLL: ${bodyW}px, DOC_SCROLL: ${docW}px\n`;
  
  const all = document.querySelectorAll('*');
  const over = [];
  all.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > winW + 1) {
      over.push(`${el.tagName}#${el.id}.${(typeof el.className === 'string' ? el.className.split(' ')[0] : '')} -> right: ${Math.round(r.right)}px, width: ${Math.round(r.width)}px, left: ${Math.round(r.left)}px`);
    }
  });
  
  result += `OVERFLOWING ELEMENTS (${over.length}):\n` + over.join('\n');
  
  const div = document.createElement('pre');
  div.id = 'DIAG_RESULT';
  div.textContent = result;
  document.body.appendChild(div);
})();
</script>
'@

$orig = Get-Content "index.html" -Raw
$withScript = $orig.Replace("</body>", "$script</body>")
Set-Content "diag.html" $withScript

# Capture with Chrome
& $chrome --headless --disable-gpu --virtual-time-budget=2000 --window-size=375,812 --dump-dom http://localhost:8080/diag.html > diag_dump.html

$dump = Get-Content "diag_dump.html" -Raw
if ($dump -match '<pre id="DIAG_RESULT"[^>]*>([\s\S]*?)</pre>') {
    Write-Host "Diagnostic Output:"
    Write-Host $matches[1]
} else {
    Write-Host "Could not find DIAG_RESULT."
}

Remove-Item "diag.html" -ErrorAction SilentlyContinue
Remove-Item "diag_dump.html" -ErrorAction SilentlyContinue
