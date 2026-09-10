$wc = New-Object System.Net.WebClient
$html = $wc.DownloadString("http://localhost:8080/index.html")
if ($html -match "css/components\.css\?v=m1") {
    Write-Host "FOUND v=m1 in served HTML!"
} else {
    Write-Host "NOT FOUND v=m1 in served HTML!"
}
