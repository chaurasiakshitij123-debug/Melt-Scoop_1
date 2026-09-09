# Melt & Scoop - Local Static Web Server
param(
    [int]$Port = 8080
)

$listener = New-Object System.Net.HttpListener
$prefix1 = "http://localhost:$Port/"
$prefix2 = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix1)
$listener.Prefixes.Add($prefix2)

try {
    $listener.Start()
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host " MELT & SCOOP™ ICE CREAM SERVER RUNNING" -ForegroundColor Magenta
    Write-Host " Local URL:  $prefix1" -ForegroundColor Green
    Write-Host " Alt URL:    $prefix2" -ForegroundColor Green
    Write-Host " Press Ctrl+C to stop the server." -ForegroundColor Gray
    Write-Host "========================================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $localPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrEmpty($localPath) -or $localPath -eq '/') {
                $localPath = "index.html"
            }

            $localPath = $localPath -replace '/', '\'
            $filePath = Join-Path $PSScriptRoot $localPath

            if (Test-Path $filePath -PathType Leaf) {
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($extension) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".webp" { "image/webp" }
                    ".svg"  { "image/svg+xml" }
                    ".ico"  { "image/x-icon" }
                    default { "application/octet-stream" }
                }

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = $contentType
                $response.StatusCode = 200
                $response.ContentLength64 = $bytes.Length
                $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1><p>File $localPath not found.</p>")
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $errBytes.Length
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.Close()
        } catch {}
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
