$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$script = @'
<script>
window.addEventListener('DOMContentLoaded', () => {
  const getBox = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return `${sel}: null`;
    const r = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return `${sel} -> L:${Math.round(r.left)} R:${Math.round(r.right)} W:${Math.round(r.width)} (disp:${style.display}, vis:${style.visibility})`;
  };
  
  const report = [
    `WIN: ${window.innerWidth}`,
    getBox('.site-header'),
    getBox('.header-container'),
    getBox('.header-left-logo'),
    getBox('.header-center-nav'),
    getBox('.header-right-utils'),
    getBox('.header-search-btn'),
    getBox('.header-cart-pill'),
    getBox('.mobile-menu-btn')
  ].join('\n');
  
  document.title = "BOXES: " + report.replace(/\n/g, ' ;; ');
});
</script>
'@

$orig = Get-Content "index.html" -Raw
$withScript = $orig.Replace("</body>", "$script</body>")
Set-Content "header_test.html" $withScript

$dom = & $chrome --headless --disable-gpu --virtual-time-budget=2000 --window-size=375,812 --dump-dom http://localhost:8080/header_test.html

if ($dom -match "<title>([\s\S]*?)</title>") {
    Write-Host "Title: " $matches[1]
} else {
    Write-Host "No title found."
}

Remove-Item "header_test.html" -ErrorAction SilentlyContinue
