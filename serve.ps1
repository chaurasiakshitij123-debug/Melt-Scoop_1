# Melt & Scoop - Local Web Server with Live Visual Publishing API
param(
    [int]$Port = 8080
)

$listener = New-Object System.Net.HttpListener
$prefix1 = "http://localhost:$Port/"
$prefix2 = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix1)
$listener.Prefixes.Add($prefix2)

$SECRET_PIN = "4321"
$uploadsDir = Join-Path $PSScriptRoot "assets\images\uploads"
if (!(Test-Path $uploadsDir)) {
    New-Item -Path $uploadsDir -ItemType Directory -Force | Out-Null
}
$backupsDir = Join-Path $PSScriptRoot "backups"
if (!(Test-Path $backupsDir)) {
    New-Item -Path $backupsDir -ItemType Directory -Force | Out-Null
}

try {
    $listener.Start()
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host " MELT & SCOOP SERVER RUNNING ON PORT $Port" -ForegroundColor Magenta
    Write-Host " Local URL:      $prefix1" -ForegroundColor Green
    Write-Host " Live Editor:    Triple-click logo (PIN: $SECRET_PIN)" -ForegroundColor Yellow
    Write-Host " API Endpoints:  /api/publish, /api/upload-image" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            # Common CORS Headers
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, X-Editor-PIN")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.Close()
                continue
            }

            $rawPath = $request.Url.LocalPath.ToLower()

            # API: /api/publish
            if ($request.HttpMethod -eq "POST" -and $rawPath -eq "/api/publish") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $bodyStr = $reader.ReadToEnd()
                $json = $bodyStr | ConvertFrom-Json

                if ($json.pin -ne $SECRET_PIN) {
                    $response.StatusCode = 403
                    $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Invalid PIN"}')
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                    $response.Close()
                    continue
                }

                if (![string]::IsNullOrEmpty($json.html)) {
                    $indexPath = Join-Path $PSScriptRoot "index.html"
                    # Timestamped backup
                    $timestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
                    $backupPath = Join-Path $backupsDir "index_$timestamp.html"
                    if (Test-Path $indexPath) {
                        Copy-Item -Path $indexPath -Destination $backupPath -Force
                        Copy-Item -Path $indexPath -Destination (Join-Path $PSScriptRoot "index.backup.html") -Force
                    }

                    # Write updated HTML
                    [System.IO.File]::WriteAllText($indexPath, $json.html, [System.Text.Encoding]::UTF8)

                    $response.StatusCode = 200
                    $response.ContentType = "application/json; charset=utf-8"
                    $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"message":"Website successfully published to disk!"}')
                    $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                } else {
                    $response.StatusCode = 400
                    $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"No HTML content provided"}')
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                }
                $response.Close()
                continue
            }

            # API: /api/upload-image
            if ($request.HttpMethod -eq "POST" -and $rawPath -eq "/api/upload-image") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $bodyStr = $reader.ReadToEnd()
                $json = $bodyStr | ConvertFrom-Json

                if ($json.pin -ne $SECRET_PIN) {
                    $response.StatusCode = 403
                    $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Invalid PIN"}')
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                    $response.Close()
                    continue
                }

                if (![string]::IsNullOrEmpty($json.data)) {
                    $rawImgData = [string]$json.data
                    $ext = "png"
                    if ($rawImgData -like "data:image/*") {
                        $parts = $rawImgData -split ';base64,'
                        $headerPart = $parts[0]
                        $base64 = $parts[1]
                        if ($headerPart -match "jpeg|jpg") { $ext = "jpg" }
                        elseif ($headerPart -match "webp") { $ext = "webp" }
                        elseif ($headerPart -match "gif") { $ext = "gif" }
                        elseif ($headerPart -match "svg") { $ext = "svg" }
                    } else {
                        $base64 = $rawImgData
                    }

                    $cleanName = "img"
                    if (![string]::IsNullOrEmpty($json.filename)) {
                        $cleanName = [System.IO.Path]::GetFileNameWithoutExtension($json.filename) -replace '[^a-zA-Z0-9_\-]', '_'
                    }
                    $rand = Get-Random -Minimum 1000 -Maximum 9999
                    $finalFileName = $cleanName + "_" + $rand + "." + $ext
                    $destPath = Join-Path $uploadsDir $finalFileName

                    $imgBytes = [System.Convert]::FromBase64String($base64)
                    [System.IO.File]::WriteAllBytes($destPath, $imgBytes)

                    $relUrl = "assets/images/uploads/" + $finalFileName
                    $validJson = '{"success":true,"url":"' + $relUrl + '"}'
                    $resBytes = [System.Text.Encoding]::UTF8.GetBytes($validJson)

                    $response.StatusCode = 200
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                } else {
                    $response.StatusCode = 400
                    $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"No image data provided"}')
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                }
                $response.Close()
                continue
            }

            # Static File Serving
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
