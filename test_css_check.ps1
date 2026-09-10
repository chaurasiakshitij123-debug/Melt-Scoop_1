$wc = New-Object System.Net.WebClient
$css = $wc.DownloadString("http://localhost:8080/css/components.css?v=m1")
if ($css -match "mobile-menu-btn") {
    Write-Host "FOUND mobile-menu-btn in served CSS!"
} else {
    Write-Host "NOT FOUND mobile-menu-btn in served CSS!"
}
