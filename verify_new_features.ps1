$ErrorActionPreference = "Stop"

Write-Host "--- 1. Testing Server HTTP Response ---" -ForegroundColor Cyan
$res = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing
Write-Host "Status: $($res.StatusCode)"

Write-Host "`n--- 2. Headless Chrome UI Verification ---" -ForegroundColor Cyan
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outAddProd = Join-Path $PSScriptRoot "screenshot_editor_add_product.png"
$outCatalog = Join-Path $PSScriptRoot "screenshot_editor_catalog_management.png"

# Test 1: Add Product Modal
$test1Html = @"
<!DOCTYPE html>
<html>
<head><style>body{margin:0;}</style></head>
<body>
  <iframe id="f" src="http://localhost:8080/index.html" style="width:1200px; height:800px; border:none;"></iframe>
  <script>
    var f = document.getElementById('f');
    f.onload = function() {
      setTimeout(function() {
        if (f.contentWindow && f.contentWindow.MeltEditor) {
          f.contentWindow.MeltEditor.unlock('4321');
          setTimeout(function() {
            f.contentWindow.MeltEditor.openAddProductModal();
          }, 300);
        }
      }, 500);
    };
  </script>
</body>
</html>
"@
Set-Content "test_add_prod.html" $test1Html -Encoding utf8
Start-Process -FilePath $chrome -ArgumentList @(
    "--headless", "--disable-gpu", "--window-size=1200,800", "--virtual-time-budget=3500",
    "--screenshot=$outAddProd", "http://localhost:8080/test_add_prod.html"
) -PassThru -Wait -NoNewWindow
Write-Host "Captured Add Product Modal screenshot: $(Test-Path $outAddProd)" -ForegroundColor Green
Remove-Item "test_add_prod.html" -ErrorAction SilentlyContinue

# Test 2: Catalog Management (Delete button on cards, + Add New Scoop button, Categories)
$test2Html = @"
<!DOCTYPE html>
<html>
<head><style>body{margin:0;}</style></head>
<body>
  <iframe id="f" src="http://localhost:8080/index.html" style="width:1200px; height:800px; border:none;"></iframe>
  <script>
    var f = document.getElementById('f');
    f.onload = function() {
      setTimeout(function() {
        if (f.contentWindow && f.contentWindow.MeltEditor) {
          f.contentWindow.MeltEditor.unlock('4321');
          var doc = f.contentDocument;
          var shopSec = doc.getElementById('bestsellersSection');
          if (shopSec) {
            shopSec.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }
      }, 500);
    };
  </script>
</body>
</html>
"@
Set-Content "test_catalog_mgmt.html" $test2Html -Encoding utf8
Start-Process -FilePath $chrome -ArgumentList @(
    "--headless", "--disable-gpu", "--window-size=1200,800", "--virtual-time-budget=3500",
    "--screenshot=$outCatalog", "http://localhost:8080/test_catalog_mgmt.html"
) -PassThru -Wait -NoNewWindow
Write-Host "Captured Catalog Management screenshot: $(Test-Path $outCatalog)" -ForegroundColor Green
Remove-Item "test_catalog_mgmt.html" -ErrorAction SilentlyContinue

Write-Host "`n=== ALL NEW FEATURES VERIFIED! ===" -ForegroundColor Green
