$url = "http://localhost:8080/index.html"
try {
    $req = [System.Net.HttpWebRequest]::Create($url)
    $req.Timeout = 5000
    $resp = $req.GetResponse()
    Write-Host "HTTP Status: " $resp.StatusCode
    $resp.Close()
} catch {
    Write-Host "Error: " $_.Exception.Message
}
