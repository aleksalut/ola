# =============================================================================
# SKRYPT URUCHOMIENIA APLIKACJI PERSONAL GROWTH
# =============================================================================
# Uruchom ten skrypt w PowerShell: .\start-app.ps1
# =============================================================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PERSONAL GROWTH - URUCHAMIANIE APLIKACJI" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\projektyOla\ola"
$backendPath = "$projectRoot\ola"
$frontendPath = "$projectRoot\ola\client"

# Sprawdz czy SQL Server dziala
Write-Host "[1/5] Sprawdzanie SQL Server Express..." -ForegroundColor Yellow
$sqlService = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue
if ($sqlService -and $sqlService.Status -eq "Running") {
    Write-Host "      SQL Server Express: DZIALA" -ForegroundColor Green
} elseif ($sqlService) {
    Write-Host "      Uruchamianie SQL Server Express..." -ForegroundColor Yellow
    Start-Service -Name "MSSQL`$SQLEXPRESS"
    Start-Sleep -Seconds 3
    Write-Host "      SQL Server Express: URUCHOMIONY" -ForegroundColor Green
} else {
    Write-Host "      BLAD: SQL Server Express nie jest zainstalowany!" -ForegroundColor Red
    Write-Host "      Pobierz z: https://www.microsoft.com/sql-server/sql-server-downloads" -ForegroundColor Yellow
    exit 1
}

# Sprawdz baze danych
Write-Host "[2/5] Sprawdzanie bazy danych..." -ForegroundColor Yellow
Set-Location $backendPath
$dbExists = dotnet ef database update 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Baza danych: OK" -ForegroundColor Green
} else {
    Write-Host "      BLAD: Problem z baza danych" -ForegroundColor Red
    Write-Host $dbExists
    exit 1
}

# Zamknij poprzednie instancje
Write-Host "[3/5] Zamykanie poprzednich instancji..." -ForegroundColor Yellow
$dotnetProcesses = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq "" }
if ($dotnetProcesses) {
    $dotnetProcesses | Stop-Process -Force
    Write-Host "      Zamknieto poprzednie procesy dotnet" -ForegroundColor Green
}

# Uruchom backend
Write-Host "[4/5] Uruchamianie backendu..." -ForegroundColor Yellow
Set-Location $backendPath
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; dotnet run" -WindowStyle Normal
Start-Sleep -Seconds 5
Write-Host "      Backend: http://localhost:5257" -ForegroundColor Green
Write-Host "      Swagger: http://localhost:5257/swagger" -ForegroundColor Green

# Uruchom frontend
Write-Host "[5/5] Uruchamianie frontendu..." -ForegroundColor Yellow
Set-Location $frontendPath

# Sprawdz czy node_modules istnieje
if (-not (Test-Path "node_modules")) {
    Write-Host "      Instalowanie zaleznosci npm..." -ForegroundColor Yellow
    npm install
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Host "      Frontend: http://localhost:5173" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  APLIKACJA URUCHOMIONA!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:5257" -ForegroundColor White
Write-Host "  Swagger:  http://localhost:5257/swagger" -ForegroundColor White
Write-Host ""
Write-Host "  DANE LOGOWANIA:" -ForegroundColor Yellow
Write-Host "  Email:    demo@example.com" -ForegroundColor White
Write-Host "  Haslo:    Demo@123" -ForegroundColor White
Write-Host ""
Write-Host "  lub:" -ForegroundColor Yellow
Write-Host "  Email:    test@test.com" -ForegroundColor White
Write-Host "  Haslo:    Test@123" -ForegroundColor White
Write-Host ""

# Otworz przegladarke
Start-Process "http://localhost:5173"
