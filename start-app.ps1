# =============================================================================
# AUTOMATYCZNE URUCHOMIENIE - PERSONAL GROWTH APP
# =============================================================================
# Ten skrypt automatycznie uruchamia backend i frontend w osobnych oknach
# Uruchom: .\start-app.ps1
# =============================================================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PERSONAL GROWTH - AUTO START" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Sprawdź wymagania
Write-Host "[1/4] Sprawdzanie wymagań..." -ForegroundColor Yellow

# Sprawdź .NET
try {
    $dotnetVersion = dotnet --version
    Write-Host "      ✓ .NET SDK: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "      ✗ .NET SDK nie znaleziony!" -ForegroundColor Red
    Write-Host "        Pobierz z: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    exit 1
}

# Sprawdź Node.js
try {
    $nodeVersion = node --version
    Write-Host "      ✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "      ✗ Node.js nie znaleziony!" -ForegroundColor Red
    Write-Host "        Pobierz z: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Sprawdź SQL Server
try {
    $sqlService = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction Stop
    if ($sqlService.Status -eq "Running") {
        Write-Host "      ✓ SQL Server: Running" -ForegroundColor Green
    } else {
        Write-Host "      ! SQL Server nie działa. Uruchamiam..." -ForegroundColor Yellow
        Start-Service -Name "MSSQL`$SQLEXPRESS"
        Write-Host "      ✓ SQL Server uruchomiony" -ForegroundColor Green
    }
} catch {
    Write-Host "      ✗ SQL Server Express nie znaleziony!" -ForegroundColor Red
    Write-Host "        Zainstaluj z: https://www.microsoft.com/sql-server/sql-server-downloads" -ForegroundColor Yellow
    exit 1
}

# Sprawdź czy baza istnieje
Write-Host ""
Write-Host "[2/4] Sprawdzanie bazy danych..." -ForegroundColor Yellow

$olaPath = Join-Path $projectRoot "ola"
Push-Location $olaPath

# Sprawdź czy są migracje
$migrationsPath = Join-Path $olaPath "Migrations"
if (-not (Test-Path $migrationsPath)) {
    Write-Host "      ! Brak migracji. Tworzę..." -ForegroundColor Yellow
    dotnet ef migrations add InitialCreate
    Write-Host "      ✓ Migracja utworzona" -ForegroundColor Green
}

# Zastosuj migracje
Write-Host "      Aktualizuję bazę danych..." -ForegroundColor White
dotnet ef database update | Out-Null
Write-Host "      ✓ Baza danych gotowa" -ForegroundColor Green

Pop-Location

# Uruchom backend
Write-Host ""
Write-Host "[3/4] Uruchamiam backend..." -ForegroundColor Yellow
$backendCmd = "Set-Location '$olaPath'; Write-Host 'Backend uruchomiony na http://localhost:5257' -ForegroundColor Green; dotnet run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
Write-Host "      ✓ Backend uruchomiony w nowym oknie" -ForegroundColor Green
Write-Host "      URL: http://localhost:5257" -ForegroundColor Cyan

# Poczekaj na backend
Write-Host "      Czekam 10 sekund na uruchomienie backendu..." -ForegroundColor White
Start-Sleep -Seconds 10

# Uruchom frontend
Write-Host ""
Write-Host "[4/4] Uruchamiam frontend..." -ForegroundColor Yellow
$clientPath = Join-Path $olaPath "client"

# Sprawdź czy są zainstalowane zależności
$nodeModulesPath = Join-Path $clientPath "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "      Instaluję zależności npm..." -ForegroundColor White
    Push-Location $clientPath
    npm install | Out-Null
    Pop-Location
    Write-Host "      ✓ Zależności zainstalowane" -ForegroundColor Green
}

$frontendCmd = "Set-Location '$clientPath'; Write-Host 'Frontend uruchomiony na http://localhost:5173' -ForegroundColor Green; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd
Write-Host "      ✓ Frontend uruchomiony w nowym oknie" -ForegroundColor Green
Write-Host "      URL: http://localhost:5173" -ForegroundColor Cyan

# Podsumowanie
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  APLIKACJA URUCHOMIONA!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Backend:  http://localhost:5257" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "  Zaloguj się:" -ForegroundColor Yellow
Write-Host "  Email: admin@admin.com" -ForegroundColor White
Write-Host "  Hasło: Adusia2025$#" -ForegroundColor White
Write-Host ""
Write-Host "  Aby zaimportować dane testowe:" -ForegroundColor Yellow
Write-Host "  cd Dokumentacja\manual" -ForegroundColor White
Write-Host "  .\import-data.ps1" -ForegroundColor White
Write-Host ""
Write-Host "  UWAGA: Nie zamykaj otwartych okien PowerShell!" -ForegroundColor Red
Write-Host ""

# Otwórz przeglądarkę
Start-Sleep -Seconds 3
Write-Host "  Otwieram przeglądarkę..." -ForegroundColor White
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Gotowe! 🎉" -ForegroundColor Green
