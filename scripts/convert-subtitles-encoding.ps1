# ────────────────────────────────────────────────────────────────────────────
# convert-subtitles-encoding.ps1
# Convierte los subtitulos del curso AWS (Latin-1/Windows-1252) a UTF-8 sin BOM.
# - Detecta por archivo: si ya es UTF-8 valido, no lo toca.
# - Preserva CRLF y estructura. Anade newline final a .txt que no lo tienen.
# - Verifica al final que el 100% de los archivos se lean con UTF-8 estricto.
# ────────────────────────────────────────────────────────────────────────────

param(
    [string]$Root = "D:\Projects\scrapping\subtitulos_es"
)

$ErrorActionPreference = "Stop"
$latin1 = [System.Text.Encoding]::GetEncoding(28591)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false, $false)
$utf8Strict = New-Object System.Text.UTF8Encoding($false, $true)

if (-not (Test-Path -LiteralPath $Root)) {
    Write-Error "Ruta no existe: $Root"
    exit 1
}

$all = Get-ChildItem -LiteralPath $Root -File -Recurse
$converted = 0
$skippedUtf8 = 0
$newlineAdded = 0
$errors = @()

foreach ($f in $all) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)

    # 1) Ya es UTF-8 valido? -> no tocar
    $isUtf8 = $true
    try {
        $null = $utf8Strict.GetString($bytes)
    } catch {
        $isUtf8 = $false
    }

    if ($isUtf8) {
        $skippedUtf8++
        continue
    }

    # 2) Convertir Latin-1 -> UTF-8 (byte -> chars Latin-1 -> bytes UTF-8)
    $text = $latin1.GetString($bytes)

    # 3) Normalizar CRLF y anadir newline final en .txt
    $text = $text -replace "`r?`n", "`r`n"
    if ($f.Extension -eq ".txt" -and -not $text.EndsWith("`n")) {
        $text = $text + "`r`n"
        $newlineAdded++
    }

    $outBytes = $utf8NoBom.GetBytes($text)
    try {
        [System.IO.File]::WriteAllBytes($f.FullName, $outBytes)
        $converted++
    } catch {
        $errors += "$($f.FullName): $($_.Exception.Message)"
    }
}

# ── Verificacion final ───────────────────────────────────────────────────────
$verify = Get-ChildItem -LiteralPath $Root -File -Recurse
$fail = 0
$sample = @()
foreach ($f in $verify) {
    $b = [System.IO.File]::ReadAllBytes($f.FullName)
    try {
        $null = $utf8Strict.GetString($b)
    } catch {
        $fail++
        if ($sample.Count -lt 5) { $sample += $f.Name }
    }
}

Write-Host "=============================================="
Write-Host " Conversión de subtítulos completada"
Write-Host "----------------------------------------------"
Write-Host " Archivos convertidos:  $converted"
Write-Host " Ya eran UTF-8 (om.):   $skippedUtf8"
Write-Host " Newline final anadido: $newlineAdded"
Write-Host " Errores:               $($errors.Count)"
Write-Host " Verificacion UTF-8:    $fail fallos / $($verify.Count) total"
Write-Host "=============================================="

if ($fail -gt 0) {
    Write-Host ""
    Write-Host "FALLOS de verificacion (muestra):"
    $sample | ForEach-Object { Write-Host "  - $_" }
    if ($errors.Count -gt 0) {
        Write-Host ""
        Write-Host "Errores de escritura:"
        $errors | ForEach-Object { Write-Host "  - $_" }
    }
    exit 1
}

# Muestreo de acentos para confirmacion humana
$probe = Get-ChildItem -LiteralPath $Root -File -Recurse -Filter "*.txt" | Select-Object -First 1
if ($probe) {
    $content = [System.IO.File]::ReadAllText($probe.FullName, $utf8NoBom)
    Write-Host ""
    Write-Host "Muestreo de verificacion: $($probe.Name)"
    Write-Host ($content.Substring(0, [Math]::Min(160, $content.Length)))
}

Write-Host ""
Write-Host "OK - Todos los subtitulos quedaron en UTF-8 valido."
exit 0
