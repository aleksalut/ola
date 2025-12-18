# Skrypt do dodania danych testowych
Write-Host "`n📋 DODAWANIE DANYCH TESTOWYCH`n" -ForegroundColor Cyan

# 1. Rejestracja użytkownika
Write-Host "1. Tworzę użytkownika test@test.com..." -ForegroundColor Yellow

$registerBody = @{
    email = "test@test.com"
    password = "Test@123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5257/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "   OK Uzytkownik utworzony" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "   INFO Uzytkownik juz istnieje" -ForegroundColor Gray
    } else {
        Write-Host "   WARN Blad: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# 2. Login
Write-Host "`n2. Loguję się..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@test.com"
    password = "Test@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5257/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
Write-Host "   ✅ Zalogowano pomyślnie" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Dodaj cele
Write-Host "`n3. Dodaję 6 celów..." -ForegroundColor Yellow

$goals = @(
    @{ title = "Nauczyć się ASP.NET Core"; description = "Opanować framework do tworzenia API"; whyReason = "Chcę rozwijać karierę jako backend developer"; deadline = "2025-06-30T00:00:00"; priority = 1 }
    @{ title = "Czytać 30 minut dziennie"; description = "Budować nawyk codziennego czytania"; whyReason = "Chcę poszerzać swoją wiedzę i rozwijać się intelektualnie"; deadline = "2025-12-31T00:00:00"; priority = 2 }
    @{ title = "Biegać 3 razy w tygodniu"; description = "Regularne treningi biegowe"; whyReason = "Chcę poprawić kondycję i zdrowie"; deadline = "2025-07-31T00:00:00"; priority = 1 }
    @{ title = "Nauczyć się React"; description = "Opanować tworzenie aplikacji frontendowych"; whyReason = "Chcę być full-stack developerem"; deadline = "2025-08-31T00:00:00"; priority = 2 }
    @{ title = "Medytować codziennie"; description = "Praktyka mindfulness 10 minut"; whyReason = "Chcę redukować stres i poprawić koncentrację"; deadline = "2025-12-31T00:00:00"; priority = 0 }
    @{ title = "Ukończyć kurs online"; description = "Kurs zaawansowany z programowania"; whyReason = "Chcę zdobyć certyfikat i nowe umiejętności"; deadline = "2025-09-30T00:00:00"; priority = 1 }
)

$goalIds = @()
foreach ($goal in $goals) {
    $goalJson = $goal | ConvertTo-Json -Compress
    $createdGoal = Invoke-RestMethod -Uri "http://localhost:5257/api/goals" -Method POST -Body $goalJson -Headers $headers
    $goalIds += $createdGoal.id
    Write-Host "   ✓ $($goal.title)" -ForegroundColor White
}

# 4. Aktualizuj postęp celów
Write-Host "`n4. Ustawiam postęp celów..." -ForegroundColor Yellow
$progressValues = @(80, 15, 45, 30, 60, 25)

for ($i = 0; $i -lt $goalIds.Count; $i++) {
    $updateBody = @{ progressPercentage = $progressValues[$i] } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "http://localhost:5257/api/goals/$($goalIds[$i])" -Method PATCH -Body $updateBody -Headers $headers | Out-Null
    Write-Host "   ✓ Cel $($i+1): $($progressValues[$i])%" -ForegroundColor White
}

# 5. Dodaj nawyki
Write-Host "`n5. Dodaję 5 nawyków..." -ForegroundColor Yellow

$habits = @(
    @{ name = "Picie wody"; description = "8 szklanek dziennie" }
    @{ name = "Ćwiczenia"; description = "30 minut aktywności fizycznej" }
    @{ name = "Nauka programowania"; description = "1 godzina kodowania" }
    @{ name = "Sen"; description = "Spać minimum 7 godzin" }
    @{ name = "Czytanie książek"; description = "30 minut codziennie" }
)

$habitIds = @()
foreach ($habit in $habits) {
    $habitJson = $habit | ConvertTo-Json -Compress
    $createdHabit = Invoke-RestMethod -Uri "http://localhost:5257/api/habits" -Method POST -Body $habitJson -Headers $headers
    $habitIds += $createdHabit.id
    Write-Host "   ✓ $($habit.name)" -ForegroundColor White
}

# 6. Dodaj daily progress dla nawyków (31 dni)
Write-Host "`n6. Dodaję postęp nawyków (31 dni dla każdego)..." -ForegroundColor Yellow

$startDate = (Get-Date).AddDays(-30)
$progressCount = 0

foreach ($habitId in $habitIds) {
    for ($day = 0; $day -lt 31; $day++) {
        $date = $startDate.AddDays($day).ToString("yyyy-MM-dd")
        $value = Get-Random -Minimum 50 -Maximum 100
        
        $progressBody = @{
            habitId = $habitId
            date = $date
            value = $value
        } | ConvertTo-Json -Compress
        
        try {
            Invoke-RestMethod -Uri "http://localhost:5257/api/progress" -Method POST -Body $progressBody -Headers $headers | Out-Null
            $progressCount++
        } catch {
            # Ignoruj duplikaty
        }
    }
    Write-Host "   ✓ Nawyk $habitId: 31 dni postępu" -ForegroundColor White
}

# 7. Dodaj wpisy emocji
Write-Host "`n7. Dodaję wpisy emocji..." -ForegroundColor Yellow

$emotions = @(
    @{ date = (Get-Date).AddDays(-9).ToString("yyyy-MM-ddT10:00:00"); emotion = "Spokojny"; text = "Dobry początek tygodnia"; anxiety = 2; joy = 7; anger = 1; calmness = 8; boredom = 3 }
    @{ date = (Get-Date).AddDays(-8).ToString("yyyy-MM-ddT14:30:00"); emotion = "Zadowolony"; text = "Produktywny dzień pracy"; anxiety = 3; joy = 8; anger = 1; calmness = 7; boredom = 2 }
    @{ date = (Get-Date).AddDays(-7).ToString("yyyy-MM-ddT09:15:00"); emotion = "Zmotywowany"; text = "Nowy projekt w pracy"; anxiety = 4; joy = 9; anger = 0; calmness = 6; boredom = 1 }
    @{ date = (Get-Date).AddDays(-6).ToString("yyyy-MM-ddT16:45:00"); emotion = "Zestresowany"; text = "Deadline zbliża się"; anxiety = 8; joy = 3; anger = 4; calmness = 2; boredom = 1 }
    @{ date = (Get-Date).AddDays(-5).ToString("yyyy-MM-ddT11:20:00"); emotion = "Spokojny"; text = "Medytacja pomogła"; anxiety = 3; joy = 6; anger = 1; calmness = 9; boredom = 2 }
    @{ date = (Get-Date).AddDays(-4).ToString("yyyy-MM-ddT15:00:00"); emotion = "Podekscytowany"; text = "Nowa funkcja działa!"; anxiety = 2; joy = 9; anger = 0; calmness = 6; boredom = 0 }
    @{ date = (Get-Date).AddDays(-3).ToString("yyyy-MM-ddT10:30:00"); emotion = "Zmęczony"; text = "Za mało snu ostatnio"; anxiety = 5; joy = 4; anger = 3; calmness = 3; boredom = 6 }
    @{ date = (Get-Date).AddDays(-2).ToString("yyyy-MM-ddT13:15:00"); emotion = "Radosny"; text = "Weekend w górach"; anxiety = 1; joy = 10; anger = 0; calmness = 9; boredom = 0 }
    @{ date = (Get-Date).AddDays(-1).ToString("yyyy-MM-ddT09:45:00"); emotion = "Zrelaksowany"; text = "Dobry odpoczynek"; anxiety = 2; joy = 7; anger = 0; calmness = 9; boredom = 2 }
    @{ date = (Get-Date).ToString("yyyy-MM-ddT08:00:00"); emotion = "Energiczny"; text = "Gotowy na nowy tydzień"; anxiety = 3; joy = 8; anger = 0; calmness = 7; boredom = 1 }
)

foreach ($emotion in $emotions) {
    $emotionJson = $emotion | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "http://localhost:5257/api/emotionentries" -Method POST -Body $emotionJson -Headers $headers | Out-Null
    Write-Host "   ✓ $($emotion.emotion) - $($emotion.date.Substring(0,10))" -ForegroundColor White
}

Write-Host "`n✅ DANE TESTOWE DODANE POMYŚLNIE!`n" -ForegroundColor Green
Write-Host "📊 Podsumowanie:" -ForegroundColor Cyan
Write-Host "   • Użytkownik: test@test.com / Test@123" -ForegroundColor White
Write-Host "   • Cele: 6 (postęp 15%-80%)" -ForegroundColor White
Write-Host "   • Nawyki: 5" -ForegroundColor White
Write-Host "   • Postęp dzienny: $progressCount wpisów (31 dni × 5 nawyków)" -ForegroundColor White
Write-Host "   • Wpisy emocji: 10" -ForegroundColor White
Write-Host "`n🌐 Backend: http://localhost:5257" -ForegroundColor Cyan
Write-Host "📚 Swagger: http://localhost:5257/swagger`n" -ForegroundColor Cyan
