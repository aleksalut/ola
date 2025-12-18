# =============================================================================
# SKRYPT IMPORTU DANYCH Z BACKUP - PERSONAL GROWTH
# =============================================================================
# Ten skrypt importuje dane z pliku backup_data.json
# 
# WAŻNE: Przed uruchomieniem upewnij się, że:
# 1. Backend działa na http://localhost:5257
# 2. Frontend działa na http://localhost:5173  
# 3. Ustawiłeś ExecutionPolicy: Set-ExecutionPolicy -Bypass -Scope Process
#
# Uruchom: .\import-data.ps1
# =============================================================================

param(
    [string]$BackupFile = "backup_data.json",
    [string]$Email = "test@test.com",
    [string]$Password = "Test@123"
)

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:5257/api"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backupPath = Join-Path $scriptPath $BackupFile

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  IMPORT DANYCH Z BACKUP" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Sprawdz plik backup
if (-not (Test-Path $backupPath)) {
    Write-Host "BLAD: Nie znaleziono pliku $backupPath" -ForegroundColor Red
    Write-Host "Uzyj skryptu seed-data.ps1 zamiast tego" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/5] Wczytywanie backup z $BackupFile..." -ForegroundColor Yellow
$backup = Get-Content $backupPath -Raw | ConvertFrom-Json
Write-Host "      Znaleziono:" -ForegroundColor Green
Write-Host "      - Celow: $($backup.goals.Count)" -ForegroundColor White
Write-Host "      - Nawykow: $($backup.habits.Count)" -ForegroundColor White
Write-Host "      - Emocji: $($backup.emotions.Count)" -ForegroundColor White

# Test polaczenia z backendem
Write-Host "[2/5] Sprawdzanie backendu..." -ForegroundColor Yellow
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"x","password":"x"}' -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 400) {
        Write-Host "      Backend dziala!" -ForegroundColor Green
    } else {
        Write-Host "      BLAD: Backend nie odpowiada" -ForegroundColor Red
        Write-Host "      Uruchom najpierw: cd ola; dotnet run" -ForegroundColor Yellow
        exit 1
    }
}

# Rejestracja/Logowanie
Write-Host "[3/5] Logowanie jako $Email..." -ForegroundColor Yellow

# Sprobuj zarejestrowac
$regBody = @{
    email = $Email
    password = $Password
    firstName = "Import"
    lastName = "User"
} | ConvertTo-Json
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $regBody
    Write-Host "      Utworzono uzytkownika" -ForegroundColor Green
} catch {}

# Zaloguj
$loginBody = @{ email = $Email; password = $Password } | ConvertTo-Json
try {
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $login.token
    Write-Host "      Zalogowano!" -ForegroundColor Green
} catch {
    Write-Host "      BLAD logowania" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Import celow
Write-Host "[4/5] Importowanie celow..." -ForegroundColor Yellow
$goalsImported = 0
foreach ($goal in $backup.goals.value) {
    $body = @{
        title = $goal.title
        description = $goal.description
        whyReason = $goal.whyReason
        deadline = $goal.deadline
        priority = $goal.priority
        progressPercentage = $goal.progressPercentage
    } | ConvertTo-Json
    
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/goals" -Method POST -Headers $headers -Body $body
        $goalsImported++
        Write-Host "      + $($goal.title)" -ForegroundColor Green
    } catch {
        Write-Host "      x $($goal.title) - pominieto" -ForegroundColor Yellow
    }
}

# Import nawykow
Write-Host "[5/5] Importowanie nawykow..." -ForegroundColor Yellow
$habitsImported = 0
foreach ($habit in $backup.habits.value) {
    $body = @{
        name = $habit.name
        description = $habit.description
    } | ConvertTo-Json
    
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/habits" -Method POST -Headers $headers -Body $body
        $habitsImported++
        Write-Host "      + $($habit.name)" -ForegroundColor Green
    } catch {
        Write-Host "      x $($habit.name) - pominieto" -ForegroundColor Yellow
    }
}

# Dodaj progress dla nawykow
$habitsResponse = Invoke-RestMethod -Uri "$baseUrl/habits" -Method GET -Headers $headers
$progressAdded = 0
foreach ($habit in $habitsResponse) {
    for ($i = 1; $i -le 7; $i++) {
        $dt = (Get-Date).AddDays(-$i).ToString("yyyy-MM-ddT12:00:00")
        $v = Get-Random -Minimum 1 -Maximum 7
        $body = @{habitId=$habit.id; date=$dt; value=$v} | ConvertTo-Json
        try {
            $null = Invoke-RestMethod -Uri "$baseUrl/progress" -Method POST -Headers $headers -Body $body
            $progressAdded++
        } catch {}
    }
}

# Import emocji
$emotionsImported = 0
foreach ($emotion in $backup.emotions.value) {
    $body = @{
        date = $emotion.date
        emotion = $emotion.emotion
        text = $emotion.text
        anxiety = $emotion.anxiety
        joy = $emotion.joy
        anger = $emotion.anger
        calmness = $emotion.calmness
        boredom = $emotion.boredom
    } | ConvertTo-Json
    
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/emotionentries" -Method POST -Headers $headers -Body $body
        $emotionsImported++
    } catch {}
}

# Podsumowanie
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  IMPORT ZAKONCZONY" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Zaimportowano:" -ForegroundColor White
Write-Host "  - Celow:   $goalsImported" -ForegroundColor White
Write-Host "  - Nawykow: $habitsImported" -ForegroundColor White
Write-Host "  - Emocji:  $emotionsImported" -ForegroundColor White
Write-Host "  - Progress: $progressAdded" -ForegroundColor White
Write-Host ""
Write-Host "  Zaloguj sie:" -ForegroundColor Yellow
Write-Host "  Email: $Email" -ForegroundColor White
Write-Host "  Haslo: $Password" -ForegroundColor White
Write-Host ""
