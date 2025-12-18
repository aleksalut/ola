# Jak uruchomić aplikację Personal Growth

## Wymagania
- .NET SDK 8.0 lub nowszy
- Baza danych SQLite (automatycznie tworzona)

## Szybki start

### 1. Przejdź do folderu projektu
```bash
cd ola
```

### 2. Uruchom aplikację
```bash
dotnet run
```

### 3. Aplikacja uruchomi się na:
- **API**: http://localhost:5257
- **Swagger UI**: http://localhost:5257/swagger

## Dane logowania demo
- **Email**: `test@test.com`
- **Hasło**: `Test@123`
- **Rola**: Admin

### Stan bazy danych (aktualny)
- **6 celów** w różnych fazach realizacji (15-80% postępu)
- **5 nawyków** ze śledzeniem dziennym
- **155+ wpisów postępu** (31 dni dla każdego nawyku)
- **14 wpisów emocji** z ostatnich 10 dni
- Wszystkie dane dla użytkownika test@test.com

## Struktura bazy danych
Aplikacja używa SQLite z bazą danych `GrowthDb.db` w folderze projektu.

Przy pierwszym uruchomieniu automatycznie tworzone są:
- Tabele bazy danych
- Użytkownik demo z rolą Admin
- Przykładowe dane (cele, nawyki, emocje)

## Endpointy API

### Autoryzacja
- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Logowanie (zwraca JWT token)

### Cele (Goals)
- `GET /api/goals` - Lista celów użytkownika
- `POST /api/goals` - Dodaj nowy cel
- `PUT /api/goals/{id}` - Aktualizuj cel
- `DELETE /api/goals/{id}` - Usuń cel

### Nawyki (Habits)
- `GET /api/habits` - Lista nawyków
- `POST /api/habits` - Dodaj nawyk
- `GET /api/habits/{id}/progress` - Progres dzienny dla nawyku
- `POST /api/progress` - Zapisz progres
- `PATCH /api/goals/{id}/progress` - Aktualizuj postęp celu
- `PATCH /api/goals/{id}/status` - Aktualizuj status celu

### Emocje (Emotions)
- `GET /api/emotionentries` - Lista wpisów emocji
- `POST /api/emotionentries` - Dodaj wpis emocji

### Raporty
- `GET /api/reports/overview` - Przegląd statystyk
- `GET /api/reports/emotion-trends` - Trendy emocji
- `GET /api/reports/habit-completion` - Statystyki nawyków

### Panel Administracyjny
- `GET /api/admin/users` - Lista użytkowników (tylko Admin)
- `GET /api/admin/statistics` - Statystyki systemu (tylko Admin)

## Testowanie API

### Przykład logowania (PowerShell)
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5257/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"Test@123"}'
$token = $response.token
```

### Przykład pobrania celów (z tokenem)
```powershell
Invoke-RestMethod -Uri "http://localhost:5257/api/goals" -Method GET -Headers @{Authorization="Bearer $token"}
```

### Przykład w curl
```bash
# Logowanie
curl -X POST http://localhost:5257/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Demo@123"}'

# Pobranie celów (wstaw token z poprzedniego requestu)
curl -X GET http://localhost:5257/api/goals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend (opcjonalnie)

### Uruchomienie frontendu Vite + React
```bash
cd ola/client
npm install
npm run dev
```

Frontend uruchomi się na: http://localhost:5173

## Rozwiązywanie problemów

### Aplikacja nie startuje
- Sprawdź czy port 5257 jest wolny
- Sprawdź czy jesteś w folderze `ola` (nie w głównym folderze projektu)

### Błąd bazy danych
- Usuń plik `GrowthDb.db` i uruchom aplikację ponownie
- Baza zostanie automatycznie odtworzona

### Błąd migracji
```bash
dotnet ef database drop --force
dotnet ef database update
```

## Zatrzymanie aplikacji
Naciśnij `Ctrl+C` w terminalu
