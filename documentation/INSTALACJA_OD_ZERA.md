# Instalacja projektu Personal Growth od zera - kompletny przewodnik

## Spis treści
1. [Wymagania](#wymagania)
2. [Instalacja oprogramowania](#instalacja-oprogramowania)
3. [Konfiguracja projektu](#konfiguracja-projektu)
4. [Inicjalizacja bazy danych](#inicjalizacja-bazy-danych)
5. [Uruchomienie aplikacji](#uruchomienie-aplikacji)
6. [Weryfikacja instalacji](#weryfikacja-instalacji)
7. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

---

## Wymagania

### System operacyjny
- Windows 10/11 (64-bit)
- PowerShell 5.1 lub nowszy

### Wolne miejsce na dysku
- Minimum 5 GB wolnego miejsca

---

## Instalacja oprogramowania

### Krok 1: Instalacja .NET SDK 8.0

#### Opcja A: Instalacja przez winget (zalecane)
Otwórz PowerShell jako administrator i wykonaj:

```powershell
winget install --id Microsoft.DotNet.SDK.8 --silent --accept-source-agreements --accept-package-agreements
```

#### Opcja B: Instalacja ręczna
1. Pobierz z: https://dotnet.microsoft.com/download/dotnet/8.0
2. Uruchom instalator
3. Postępuj zgodnie z instrukcjami instalatora

#### Weryfikacja instalacji
```powershell
# Odśwież zmienne środowiskowe
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Sprawdź wersję
dotnet --version
```
Powinno wyświetlić: `8.0.xxx`

---

### Krok 2: Instalacja Entity Framework Tools

```powershell
dotnet tool install --global dotnet-ef --version 8.0.11
```

#### Weryfikacja
```powershell
dotnet ef --version
```

---

### Krok 3: Instalacja Node.js (dla frontendu)

#### Instalacja
```powershell
winget install OpenJS.NodeJS.LTS --silent
```

#### Odśwież PATH
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

#### Włącz wykonywanie skryptów PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

#### Weryfikacja
```powershell
node --version
npm --version
```

---

### Krok 4: Instalacja Visual Studio Code (opcjonalnie)

```powershell
winget install Microsoft.VisualStudioCode
```

#### Rozszerzenia VSCode (opcjonalnie)
Po uruchomieniu VSCode, zainstaluj:
- C# Dev Kit (Microsoft)
- REST Client (Huachao Mao)
- SQLite Viewer (alexcvzz)

---

## Konfiguracja projektu

### Krok 1: Pobranie/skopiowanie projektu

Przejdź do folderu gdzie chcesz mieć projekt, np:
```powershell
cd C:\projekty
```

### Krok 2: Struktura projektu

Upewnij się że masz następującą strukturę:
```
ola/
├── ola.sln
├── ola/
│   ├── ola.csproj
│   ├── Program.cs
│   ├── appsettings.json
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Data/
│   ├── Migrations/
│   └── client/
│       ├── package.json
│       ├── vite.config.js
│       └── src/
├── Database/
│   └── backup_data.sql
└── documentation/
```

### Krok 3: Przywrócenie pakietów NuGet

```powershell
cd ola\ola
dotnet restore
```

### Krok 4: Instalacja zależności frontendu

```powershell
cd client
npm install
cd ..
```

---

## Inicjalizacja bazy danych

### Metoda 1: Automatyczne utworzenie przez migracje (zalecane dla nowej bazy)

```powershell
# Upewnij się że jesteś w folderze ola/ola
cd C:\projekty\ola\ola

# Usuń starą bazę jeśli istnieje
Remove-Item GrowthDb.db -ErrorAction SilentlyContinue

# Utwórz bazę z migracjami
dotnet ef database update
```

Po tym kroku masz pustą bazę ze strukturą, ale BEZ danych demo.

### Metoda 2: Import z backupu (zalecane dla przywrócenia danych)

#### A. Jeśli masz zainstalowane narzędzie sqlite3:

```powershell
# Usuń starą bazę
Remove-Item GrowthDb.db -ErrorAction SilentlyContinue

# Utwórz nową i załaduj dane
sqlite3 GrowthDb.db ".read ../Database/backup_data.sql"
```

#### B. Bez sqlite3 - użyj .NET:

1. Najpierw utwórz bazę migracjami:
```powershell
dotnet ef database update
```

2. Następnie dodaj dane testowe przez API (patrz sekcja Weryfikacja)

### Metoda 3: Skopiowanie gotowej bazy

Jeśli masz gotowy plik `GrowthDb.db` z danymi:
```powershell
# Skopiuj plik do folderu projektu
Copy-Item "ścieżka\do\GrowthDb.db" "C:\projekty\ola\ola\GrowthDb.db"
```

---

## Uruchomienie aplikacji

### Uruchomienie backendu

Otwórz **PIERWSZE** okno PowerShell:
```powershell
cd C:\projekty\ola\ola
dotnet run
```

Aplikacja uruchomi się na: http://localhost:5257

### Uruchomienie frontendu

Otwórz **DRUGIE** okno PowerShell:
```powershell
cd C:\projekty\ola\ola\client
npm run dev
```

Frontend uruchomi się na: http://localhost:5173

### Alternatywnie - uruchomienie w tle

Jeśli chcesz uruchomić oba serwisy w tle:

```powershell
# Backend
cd C:\projekty\ola\ola
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run"

# Frontend (w tym samym terminalu)
cd client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User'); npm run dev"
```

---

## Weryfikacja instalacji

### 1. Sprawdź czy backend działa

Otwórz przeglądarkę: http://localhost:5257/swagger

Powinieneś zobaczyć dokumentację API Swagger.

### 2. Sprawdź frontend

Otwórz: http://localhost:5173

Powinieneś zobaczyć stronę logowania aplikacji Personal Growth.

### 3. Testowe logowanie przez API

Otwórz PowerShell:
```powershell
# Test rejestracji
$body = '{"email":"test@test.com","password":"Test@123","firstName":"Test","lastName":"User"}'
Invoke-RestMethod -Uri "http://localhost:5257/api/auth/register" -Method POST -ContentType "application/json" -Body $body

# Test logowania
$body = '{"email":"test@test.com","password":"Test@123"}'
$response = Invoke-RestMethod -Uri "http://localhost:5257/api/auth/login" -Method POST -ContentType "application/json" -Body $body
$response.token
```

Jeśli otrzymasz token - wszystko działa poprawnie!

### 4. Dane logowania

Po załadowaniu danych z backupu możesz użyć:
- **Email**: `test@test.com`
- **Hasło**: `Test@123`
- **Rola**: Admin

---

## Rozwiązywanie problemów

### Problem: "dotnet" nie jest rozpoznawane

**Rozwiązanie:**
```powershell
# Odśwież zmienne środowiskowe
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Jeśli nie pomaga - restart PowerShell lub komputera
```

### Problem: "npm" nie jest rozpoznawane

**Rozwiązanie:**
```powershell
# 1. Odśwież PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 2. Włącz wykonywanie skryptów
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 3. Sprawdź ponownie
npm --version
```

### Problem: Port 5257 lub 5173 jest zajęty

**Rozwiązanie:**
```powershell
# Znajdź proces używający portu
Get-NetTCPConnection -LocalPort 5257 -State Listen -ErrorAction SilentlyContinue

# Zabij proces (wstaw PID z poprzedniego polecenia)
Stop-Process -Id PID_PROCESU -Force
```

### Problem: Błędy kompilacji

**Rozwiązanie:**
```powershell
cd C:\projekty\ola\ola
dotnet clean
dotnet restore
dotnet build
```

### Problem: Błędy bazy danych

**Rozwiązanie:**
```powershell
# Usuń bazę i utwórz od nowa
Remove-Item GrowthDb.db -ErrorAction SilentlyContinue
dotnet ef database update
```

### Problem: Frontend pokazuje błędy CORS

**Rozwiązanie:**
Sprawdź czy backend działa na porcie 5257. Frontend jest skonfigurowany do komunikacji z tym portem.

---

## Checklist - szybkie sprawdzenie

✅ .NET SDK 8.0 zainstalowane: `dotnet --version`  
✅ Entity Framework Tools: `dotnet ef --version`  
✅ Node.js zainstalowany: `node --version`  
✅ npm zainstalowany: `npm --version`  
✅ Pakiety NuGet przywrócone: `dotnet restore`  
✅ Pakiety npm zainstalowane: `npm install`  
✅ Baza danych utworzona: plik `GrowthDb.db` istnieje  
✅ Backend uruchomiony: http://localhost:5257/swagger  
✅ Frontend uruchomiony: http://localhost:5173  
✅ Logowanie działa: test przez Swagger lub aplikację  

---

## Podsumowanie poleceń - quick start

Dla doświadczonych użytkowników - wszystkie polecenia po kolei:

```powershell
# 1. Instalacja oprogramowania
winget install --id Microsoft.DotNet.SDK.8 --silent --accept-source-agreements --accept-package-agreements
winget install OpenJS.NodeJS.LTS --silent
dotnet tool install --global dotnet-ef --version 8.0.11
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 2. Odświeżenie PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 3. Konfiguracja projektu
cd C:\projekty\ola\ola
dotnet restore
cd client
npm install
cd ..

# 4. Baza danych
dotnet ef database update

# 5. Uruchomienie (w osobnych oknach)
# Okno 1: Backend
dotnet run

# Okno 2: Frontend
cd client
npm run dev
```

---

## Wsparcie

Dokumentacja projektu:
- **Uruchamianie**: `documentation/JAK_URUCHOMIC_APLIKACJE.md`
- **Przygotowanie środowiska**: `documentation/PRZYGOTOWANIE_SRODOWISKA.md`
- **GitHub Copilot**: `.github/copilot-instructions.md`

API: http://localhost:5257/swagger  
Frontend: http://localhost:5173

---

**Data utworzenia**: 2025-12-18  
**Wersja**: 1.0  
**Projekt**: Personal Growth - ASP.NET Core 8.0 + React + SQLite
