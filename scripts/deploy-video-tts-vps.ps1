# Deploy video-tts lên VPS từ Windows (PowerShell)
# Usage: .\scripts\deploy-video-tts-vps.ps1

$ErrorActionPreference = "Stop"
$Host_ = if ($env:MAGNIX_VPS_HOST) { $env:MAGNIX_VPS_HOST } else { "103.57.221.93" }
$Port = if ($env:MAGNIX_VPS_PORT) { $env:MAGNIX_VPS_PORT } else { "24700" }
$User = if ($env:MAGNIX_VPS_USER) { $env:MAGNIX_VPS_USER } else { "root" }
$Remote = "/opt/magnix-video-tts"
$Root = Split-Path -Parent $PSScriptRoot
$TtsDir = Join-Path $Root "webhooks\video-tts"

if (-not (Test-Path (Join-Path $TtsDir ".env"))) {
  Write-Error "Missing webhooks\video-tts\.env"
}

Write-Host "Building TypeScript locally..."
Push-Location $TtsDir
npm run build
Pop-Location

Write-Host "Uploading to ${User}@${Host_}:${Remote} ..."
ssh -p $Port "${User}@${Host_}" "mkdir -p $Remote"
scp -P $Port -r `
  (Join-Path $TtsDir "package.json") `
  (Join-Path $TtsDir "tsconfig.json") `
  (Join-Path $TtsDir "src") `
  (Join-Path $TtsDir "dist") `
  (Join-Path $TtsDir "Dockerfile") `
  (Join-Path $TtsDir ".env") `
  "${User}@${Host_}:${Remote}/"

Write-Host "Docker rebuild on VPS..."
ssh -p $Port "${User}@${Host_}" @"
cd $Remote && \
docker rm -f magnix-video-tts 2>/dev/null || true && \
docker build -t magnix-video-tts:latest . && \
docker run -d --name magnix-video-tts --restart unless-stopped -p 8765:8765 --env-file .env -v magnix_tts_data:/app/data magnix-video-tts:latest && \
sleep 2 && curl -sf http://127.0.0.1:8765/health
"@

Write-Host "`nTest batch model (expect eleven_flash_v2_5):"
Write-Host "  curl http://${Host_}:8765/health"
