# 🚀 Personal Growth - Instrukcja Uruchomienia

## 📋 Spis treści
1. [Wymagania systemowe](#wymagania-systemowe)
2. [Instalacja środowiska](#instalacja-środowiska)
3. [Konfiguracja bazy danych](#konfiguracja-bazy-danych)
4. [Uruchomienie aplikacji](#uruchomienie-aplikacji)
5. [Import danych testowych](#import-danych-testowych)
6. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

---

## 🔧 Wymagania systemowe

| Komponent | Wersja | Link do pobrania |
|-----------|--------|------------------|
| .NET SDK | 8.0+ | https://dotnet.microsoft.com/download/dotnet/8.0 |
| Node.js | 18+ LTS | https://nodejs.org/ |
| SQL Server Express | 2019/2022 | https://www.microsoft.com/pl-pl/sql-server/sql-server-downloads |
| Git | Dowolna | https://git-scm.com/ |

---

## 📥 Instalacja środowiska

### Krok 1: Instalacja .NET SDK 8.0

```powershell
# Sprawdź czy .NET jest zainstalowany
dotnet --version

# Jeśli nie - pobierz i zainstaluj z:
# https://dotnet.microsoft.com/download/dotnet/8.0
```

### Krok 2: Instalacja Node.js

```powershell
# Sprawdź czy Node.js jest zainstalowany
node --version
npm --version

# Jeśli nie - pobierz LTS z: https://nodejs.org/
```

### Krok 3: Instalacja SQL Server Express

1. Pobierz **SQL Server 2022 Express** z: https://www.microsoft.com/pl-pl/sql-server/sql-server-downloads
2. Wybierz opcję **"Basic"** podczas instalacji
3. Zapamiętaj nazwę instancji (domyślnie: `SQLEXPRESS`)
4. Po instalacji upewnij się, że usługa **SQL Server (SQLEXPRESS)** jest uruchomiona

```powershell
# Sprawdź status usługi
Get-Service -Name "MSSQL`$SQLEXPRESS"

# Jeśli nie działa, uruchom:
Start-Service -Name "MSSQL`$SQLEXPRESS"
```

### Krok 4: Instalacja Entity Framework Tools

```powershell
dotnet tool install --global dotnet-ef
```

---

## 🗄️ Konfiguracja bazy danych

### Struktura bazy danych

Aplikacja używa bazy **SQL Server Express** z następującymi tabelami:

| Tabela | Opis |
|--------|------|
| `AspNetUsers` | Użytkownicy (ASP.NET Identity) |
| `AspNetRoles` | Role użytkowników |
| `Goals` | Cele użytkowników |
| `Habits` | Nawyki do śledzenia |
| `DailyProgresses` | Dzienny postęp nawyków |
| `EmotionEntries` | Wpisy dziennika emocji |
| `AuditLogs` | Logi audytu |

### Connection String

Plik `ola/appsettings.json` zawiera connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=GrowthDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

⚠️ **Ważne**: `TrustServerCertificate=True` jest wymagane dla lokalnych połączeń bez certyfikatu SSL.

### Utworzenie bazy danych

```powershell
cd ola
dotnet ef database update
```

To polecenie:
- Utworzy bazę `GrowthDb` jeśli nie istnieje
- Zastosuje wszystkie migracje
- Utworzy tabele i dane początkowe (demo user)

---

## ▶️ Uruchomienie aplikacji

### Metoda 1: Ręczne uruchomienie (zalecana do developmentu)

**Terminal 1 - Backend:**
```powershell
cd C:\projektyOla\ola\ola
dotnet run
```
Backend uruchomi się na: `http://localhost:5257`

**Terminal 2 - Frontend:**
```powershell
cd C:\projektyOla\ola\ola\client
npm install    # tylko za pierwszym razem
npm run dev
```
Frontend uruchomi się na: `http://localhost:5173`

### Metoda 2: Skrypt automatyczny

Uruchom plik `start-app.ps1` (znajduje się w głównym katalogu):
```powershell
.\start-app.ps1
```

### Weryfikacja uruchomienia

1. Otwórz przeglądarkę: `http://localhost:5173`
2. Powinieneś zobaczyć stronę logowania
3. Swagger API: `http://localhost:5257/swagger`

---

## 📊 Import danych testowych

### Opcja A: Użyj skryptu seed-data.ps1

```powershell
cd C:\projektyOla\ola
.\seed-data.ps1
```

### Opcja B: Import z backup_data.json

Jeśli masz plik `backup_data.json`, użyj skryptu `import-data.ps1`:

```powershell
cd C:\projektyOla\ola
.\import-data.ps1
```

### Opcja C: Ręczne utworzenie użytkownika przez API

```powershell
# 1. Rejestracja użytkownika
$body = '{"email":"test@test.com","password":"Test@123","firstName":"Test","lastName":"User"}'
Invoke-RestMethod -Uri "http://localhost:5257/api/auth/register" -Method POST -ContentType "application/json" -Body $body

# 2. Logowanie
$login = Invoke-RestMethod -Uri "http://localhost:5257/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"Test@123"}'
$token = $login.token

# 3. Dodawanie danych (cele, nawyki, itp.)
# Zobacz skrypt seed-data.ps1 dla pełnego przykładu
```

### Dostępni użytkownicy testowi

| Email | Hasło | Rola |
|-------|-------|------|
| `demo@example.com` | `Demo@123` | Admin |
| `test@test.com` | `Test@123` | User |

---

## 🔍 Rozwiązywanie problemów

### Problem: "Failed to bind to address - address already in use"

Backend już działa. Zamknij poprzednią instancję:
```powershell
Get-Process -Name "dotnet" | Stop-Process -Force
```

### Problem: "Łańcuch certyfikatów nie jest zaufany"

Upewnij się, że connection string zawiera `TrustServerCertificate=True`

### Problem: "Cannot connect to SQL Server"

1. Sprawdź czy usługa działa:
```powershell
Get-Service -Name "MSSQL`$SQLEXPRESS"
```

2. Uruchom usługę:
```powershell
Start-Service -Name "MSSQL`$SQLEXPRESS"
```

### Problem: "npm install fails"

Usuń node_modules i spróbuj ponownie:
```powershell
cd ola\client
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problem: "Database does not exist"

Utwórz bazę:
```powershell
cd ola
dotnet ef database update
```

### Problem: Brak danych po restarcie

Sprawdź czy `Program.cs` NIE zawiera `EnsureDeleted()`. Ta linijka kasuje bazę przy każdym starcie!

---

## 📁 Struktura projektu

```
ola/
├── ola/                      # Backend ASP.NET Core
│   ├── Controllers/          # API endpoints
│   ├── Models/               # Entity models
│   ├── Services/             # Business logic
│   ├── Data/                 # DbContext
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Migrations/           # EF Core migrations
│   ├── client/               # Frontend React
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── pages/        # Page components
│   │   │   └── services/     # API services
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── appsettings.json      # Konfiguracja
│   └── Program.cs            # Entry point
├── Database/                 # SQL scripts
├── backup_data.json          # Backup danych
├── seed-data.ps1             # Skrypt seedowania
├── import-data.ps1           # Skrypt importu
└── start-app.ps1             # Skrypt uruchomienia
```

---

## 🎯 Szybki start (TL;DR)

```powershell
# 1. Sklonuj repo
git clone <repo-url>
cd ola

# 2. Utwórz bazę
cd ola
dotnet ef database update

# 3. Uruchom backend (Terminal 1)
dotnet run

# 4. Uruchom frontend (Terminal 2)
cd client
npm install
npm run dev

# 5. Otwórz przeglądarkę
# http://localhost:5173
# Login: demo@example.com / Demo@123
```

---

## 📞 Kontakt

W razie problemów sprawdź:
- Swagger UI: `http://localhost:5257/swagger`
- Logi w konsoli backendu
- Developer Tools w przeglądarce (F12 → Network/Console)

---

*Ostatnia aktualizacja: 18 grudnia 2025*
