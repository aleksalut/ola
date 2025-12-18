# Przygotowanie środowiska deweloperskiego

## Wymagane oprogramowanie

### 1. .NET SDK 8.0
Aplikacja wymaga .NET 8.0 SDK.

#### Instalacja (Windows - winget)
```powershell
winget install --id Microsoft.DotNet.SDK.8 --silent --accept-source-agreements --accept-package-agreements
```

#### Instalacja (ręczna)
Pobierz z: https://dotnet.microsoft.com/download/dotnet/8.0

#### Weryfikacja instalacji
```powershell
# Odśwież PATH w aktualnej sesji PowerShell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Sprawdź wersję
dotnet --version
```
Powinno wyświetlić: `8.0.xxx`

### 2. Entity Framework Core Tools
```powershell
dotnet tool install --global dotnet-ef --version 8.0.11
```

#### Weryfikacja
```powershell
dotnet ef --version
```

### 3. Node.js (opcjonalnie, dla frontendu)
Wymagane tylko jeśli chcesz uruchomić frontend React.

#### Instalacja
```powershell
winget install OpenJS.NodeJS.LTS
```

#### Weryfikacja
```powershell
node --version
npm --version
```

## Konfiguracja projektu

### 1. Sklonuj/Pobierz projekt
```bash
git clone <repository-url>
cd ola
```

### 2. Przywróć pakiety NuGet
```bash
cd ola
dotnet restore
```

### 3. Zainstaluj pakiety frontend (opcjonalnie)
```bash
cd client
npm install
cd ..
```

## Konfiguracja bazy danych

### SQLite (domyślnie)
Aplikacja używa SQLite - nie wymaga instalacji serwera bazy danych.

Baza danych jest automatycznie tworzona przy pierwszym uruchomieniu w pliku: `ola/GrowthDb.db`

### Tworzenie/Aktualizacja bazy danych
```bash
cd ola
dotnet ef database update
```

### Ponowne tworzenie bazy (jeśli potrzebne)
```bash
cd ola
dotnet ef database drop --force
dotnet ef database update
```

## Struktura projektu

```
ola/
├── ola.sln                          # Solution file
├── ola/                             # Projekt ASP.NET Core
│   ├── ola.csproj
│   ├── Program.cs                   # Główny plik startowy
│   ├── appsettings.json            # Konfiguracja
│   ├── GrowthDb.db                 # Baza danych SQLite
│   ├── Controllers/                # API Controllers
│   ├── Models/                     # Modele danych
│   ├── Services/                   # Logika biznesowa
│   ├── Data/                       # DbContext i migracje
│   ├── Migrations/                 # Migracje EF Core
│   └── client/                     # Frontend React
│       ├── src/
│       ├── package.json
│       └── vite.config.js
├── ola.Tests/                      # Testy jednostkowe
├── Database/                        # Skrypty SQL (opcjonalne)
└── documentation/                   # Dokumentacja

```

## Konfiguracja aplikacji

### appsettings.json
Plik konfiguracyjny znajduje się w: `ola/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=GrowthDb.db"
  },
  "Jwt": {
    "Issuer": "PersonalGrowthIssuer",
    "Audience": "PersonalGrowthAudience",
    "Key": "please-change-this-secret-key-to-a-strong-value",
    "ExpirationMinutes": 60
  }
}
```

### Zmiana portu aplikacji
Domyślny port: `5257`

Aby zmienić, edytuj `ola/Properties/launchSettings.json`:
```json
{
  "profiles": {
    "http": {
      "applicationUrl": "http://localhost:TWOJ_PORT"
    }
  }
}
```

## Pierwsze uruchomienie

### 1. Kompilacja projektu
```bash
cd ola
dotnet build
```

### 2. Uruchomienie aplikacji
```bash
dotnet run
```

### 3. Sprawdzenie działania
Otwórz przeglądarkę: http://localhost:5257/swagger

### 4. Zaloguj się danymi demo
- Email: `demo@example.com`
- Hasło: `Demo@123`

## Narzędzia deweloperskie (opcjonalnie)

### Visual Studio 2022
- Edycja Community (darmowa)
- Instalacja workload: "ASP.NET and web development"

### Visual Studio Code
```powershell
winget install Microsoft.VisualStudioCode
```

Rozszerzenia:
- C# Dev Kit
- SQLite Viewer
- REST Client

### SQL Server Management Studio (opcjonalnie)
Jeśli chcesz użyć SQL Server zamiast SQLite:
```powershell
winget install Microsoft.SQLServerManagementStudio
```

## Częste problemy

### "No .NET SDKs were found"
Zainstaluj .NET SDK 8.0 i zrestartuj terminal/IDE.

### "dotnet ef" nie jest rozpoznawane
```powershell
dotnet tool install --global dotnet-ef --version 8.0.11
```

### Port już zajęty
Zmień port w launchSettings.json lub zatrzymaj aplikację używającą portu 5257.

### Błędy kompilacji
```powershell
dotnet clean
dotnet restore
dotnet build
```

## Następne kroki

Po poprawnym skonfigurowaniu środowiska:
1. Przeczytaj: `JAK_URUCHOMIC_APLIKACJE.md`
2. Zapoznaj się z Swagger UI: http://localhost:5257/swagger
3. Przetestuj API z danymi demo
4. Rozpocznij developement!

## Wsparcie

W razie problemów sprawdź:
- Logi aplikacji w terminalu
- Dokumentację .NET: https://docs.microsoft.com/dotnet/
- Entity Framework Core: https://docs.microsoft.com/ef/core/
