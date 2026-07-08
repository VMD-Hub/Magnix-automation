# Export Google SA JSON to single-line base64 (safe VPS upload).
# Run on WINDOWS PowerShell only — NOT on VPS Linux.
#
# Usage:
#   cd C:\Users\nguye\Magnix-automation\Proptech-HouseX
#   .\scripts\export-google-sa-base64.ps1

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path $PSScriptRoot -Parent
$src = Join-Path $repoRoot "..\n8n-workflows\credentials\google-service-account.json"
$src = [System.IO.Path]::GetFullPath($src)
$out = Join-Path (Split-Path $src) "google-sa.b64.txt"

if (-not (Test-Path $src)) {
  Write-Error "File not found: $src"
}

$bytes = [IO.File]::ReadAllBytes($src)
$b64 = [Convert]::ToBase64String($bytes)
[IO.File]::WriteAllText($out, $b64, [Text.UTF8Encoding]::new($false))

Write-Host ""
Write-Host "OK - wrote base64 file:"
Write-Host "  $out"
Write-Host "  length: $($b64.Length) chars (expect ~3100-3300)"
Write-Host ""
Write-Host "Next on VPS Linux:"
Write-Host "  1) Open file on Windows, Ctrl+A, Ctrl+C"
Write-Host "  2) nano /tmp/sa.b64 -> paste one line -> Ctrl+O Enter Ctrl+X"
Write-Host "  3) cd /opt/housex/Proptech-HouseX"
Write-Host "  4) ./scripts/decode-google-sa.sh /tmp/sa.b64"
Write-Host ""
