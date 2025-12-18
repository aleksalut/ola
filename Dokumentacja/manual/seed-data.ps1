# =============================================================================
# SKRYPT SEEDOWANIA DANYCH - PERSONAL GROWTH
# =============================================================================
# Ten skrypt tworzy uzytkownika testowego i dodaje przykladowe dane
# Uruchom: .\seed-data.ps1
# =============================================================================

param(
    [string]$Email = "test@test.com",
    [string]$Password = "Test@123",
    [string]$FirstName = "Test",
    [string]$LastName = "User"
)

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:5257/api"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SEEDOWANIE DANYCH TESTOWYCH" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Test polaczenia z backendem
Write-Host "[1/6] Sprawdzanie backendu..." -ForegroundColor Yellow
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"x","password":"x"}' -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 400) {
        Write-Host "      Backend dziala!" -ForegroundColor Green
    } else {
        Write-Host "      BLAD: Backend nie odpowiada na $baseUrl" -ForegroundColor Red
        Write-Host "      Uruchom najpierw: cd ola; dotnet run" -ForegroundColor Yellow
        exit 1
    }
}

# Rejestracja uzytkownika
Write-Host "[2/6] Rejestracja uzytkownika $Email..." -ForegroundColor Yellow
$regBody = @{
    email = $Email
    password = $Password
    firstName = $FirstName
    lastName = $LastName
} | ConvertTo-Json

try {
    $null = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $regBody
    Write-Host "      Utworzono uzytkownika!" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "      Uzytkownik juz istnieje - OK" -ForegroundColor Yellow
    } else {
        Write-Host "      Blad rejestracji: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Logowanie
Write-Host "[3/6] Logowanie..." -ForegroundColor Yellow
$loginBody = @{ email = $Email; password = $Password } | ConvertTo-Json
try {
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $login.token
    Write-Host "      Zalogowano pomyslnie!" -ForegroundColor Green
} catch {
    Write-Host "      BLAD logowania: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Dodawanie celow
Write-Host "[4/6] Dodawanie celow..." -ForegroundColor Yellow
$goals = @(
    @{title="Nauczyc sie ASP.NET Core"; description="Opanowac framework do aplikacji webowych"; whyReason="Chce byc programista .NET"; deadline="2025-06-30"; priority=2; progressPercentage=85},
    @{title="Przeczytac 12 ksiazek"; description="Czytac przynajmniej 1 ksiazke miesiecznie"; whyReason="Rozwoj osobisty"; deadline="2025-12-31"; priority=1; progressPercentage=75},
    @{title="Przebiec polmaraton"; description="21km w mniej niz 2h"; whyReason="Zdrowie i sprawnosc"; deadline="2025-09-15"; priority=1; progressPercentage=45},
    @{title="Opanowac React"; description="Budowac aplikacje SPA"; whyReason="Frontend development"; deadline="2025-08-01"; priority=2; progressPercentage=60},
    @{title="Schudnac 10kg"; description="Zdrowa dieta i cwiczenia"; whyReason="Zdrowie"; deadline="2025-07-01"; priority=0; progressPercentage=30},
    @{title="Nauczyc sie gry na gitarze"; description="Podstawowe akordy i piosenki"; whyReason="Hobby i relaks"; deadline="2025-12-31"; priority=0; progressPercentage=20},
    @{title="Oszczedzic 10000 zl"; description="Fundusz awaryjny"; whyReason="Bezpieczenstwo finansowe"; deadline="2025-12-31"; priority=1; progressPercentage=55},
    @{title="Certyfikat SQL"; description="Microsoft SQL Server certification"; whyReason="Rozwoj kariery"; deadline="2025-05-01"; priority=2; progressPercentage=90},
    @{title="Medytowac codziennie"; description="15 minut dziennie"; whyReason="Zdrowie psychiczne"; deadline="2025-12-31"; priority=1; progressPercentage=70},
    @{title="Nauczyc sie Docker"; description="Konteneryzacja aplikacji"; whyReason="DevOps skills"; deadline="2025-10-01"; priority=2; progressPercentage=40}
)

$goalsAdded = 0
foreach ($g in $goals) {
    $body = $g | ConvertTo-Json
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/goals" -Method POST -Headers $headers -Body $body
        $goalsAdded++
        Write-Host "      + $($g.title) ($($g.progressPercentage)%)" -ForegroundColor Green
    } catch {
        Write-Host "      x $($g.title) - juz istnieje lub blad" -ForegroundColor Yellow
    }
}

# Dodawanie nawykow
Write-Host "[5/6] Dodawanie nawykow i progressu..." -ForegroundColor Yellow
$habits = @(
    @{name="Picie wody"; description="8 szklanek dziennie"},
    @{name="Poranne cwiczenia"; description="30 minut ruchu rano"},
    @{name="Czytanie"; description="30 minut przed snem"},
    @{name="Medytacja"; description="15 minut mindfulness"},
    @{name="Nauka programowania"; description="2h kodowania dziennie"},
    @{name="Zdrowe sniadanie"; description="Bez cukru"},
    @{name="Spacer"; description="10000 krokow dziennie"},
    @{name="Nauka jezyka"; description="Duolingo codziennie"},
    @{name="Planowanie dnia"; description="Wieczorne planowanie"},
    @{name="Sen o stalej porze"; description="Zasypianie przed 23"}
)

$habitsAdded = 0
foreach ($h in $habits) {
    $body = $h | ConvertTo-Json
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/habits" -Method POST -Headers $headers -Body $body
        $habitsAdded++
        Write-Host "      + $($h.name)" -ForegroundColor Green
    } catch {
        Write-Host "      x $($h.name) - juz istnieje lub blad" -ForegroundColor Yellow
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
Write-Host "      Dodano $progressAdded wpisow progressu" -ForegroundColor Green

# Dodawanie emocji
Write-Host "[6/6] Dodawanie wpisow emocji..." -ForegroundColor Yellow
$emotions = @("Radosny", "Spokojny", "Zmotywowany", "Zestresowany", "Zmeczony", "Podekscytowany", "Zrelaksowany")
$emotionsAdded = 0

for ($i = 0; $i -lt 14; $i++) {
    $date = (Get-Date).AddDays(-$i).ToString("yyyy-MM-dd")
    $emotion = $emotions[$i % $emotions.Count]
    $body = @{
        date = $date
        emotion = $emotion
        text = "Dzisiejszy dzien: $emotion"
        anxiety = (Get-Random -Minimum 1 -Maximum 6)
        joy = (Get-Random -Minimum 1 -Maximum 6)
        anger = (Get-Random -Minimum 1 -Maximum 6)
        calmness = (Get-Random -Minimum 1 -Maximum 6)
        boredom = (Get-Random -Minimum 1 -Maximum 6)
    } | ConvertTo-Json
    
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/emotionentries" -Method POST -Headers $headers -Body $body
        $emotionsAdded++
        Write-Host "      + $date - $emotion" -ForegroundColor Green
    } catch {
        Write-Host "      x $date - juz istnieje lub blad" -ForegroundColor Yellow
    }
}

# Podsumowanie
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PODSUMOWANIE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$finalGoals = (Invoke-RestMethod -Uri "$baseUrl/goals" -Headers $headers).Count
$finalHabits = (Invoke-RestMethod -Uri "$baseUrl/habits" -Headers $headers).Count
$finalEmotions = (Invoke-RestMethod -Uri "$baseUrl/emotionentries" -Headers $headers).Count

Write-Host "  Cele:    $finalGoals" -ForegroundColor White
Write-Host "  Nawyki:  $finalHabits" -ForegroundColor White
Write-Host "  Emocje:  $finalEmotions" -ForegroundColor White
Write-Host ""
Write-Host "  DANE LOGOWANIA:" -ForegroundColor Yellow
Write-Host "  Email:   $Email" -ForegroundColor White
Write-Host "  Haslo:   $Password" -ForegroundColor White
Write-Host ""
Write-Host "  Otworz: http://localhost:5173" -ForegroundColor Green
Write-Host ""
