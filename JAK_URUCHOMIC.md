# Jak uruchomić aplikację Personal Growth

## Szybkie uruchomienie

### 1. Backend (uruchom najpierw)
Otwórz terminal PowerShell i wykonaj:
```powershell
cd c:\ProjektZaliczeniowy\ola\ola
dotnet run
```

### 2. Frontend (uruchom w drugim terminalu)
Otwórz nowy terminal PowerShell i wykonaj:
```powershell
cd c:\ProjektZaliczeniowy\ola\ola\client
npm run dev
```

## Adresy aplikacji

Po uruchomieniu obu części:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5257
- **Swagger UI**: http://localhost:5257/swagger

## Dane logowania

- **Email**: `test@test.com`
- **Hasło**: `Test@123`
- **Rola**: Admin

## Zatrzymanie aplikacji

W każdym terminalu naciśnij: `Ctrl+C`

## Rozwiązywanie problemów

### Frontend nie startuje
Jeśli frontend nie działa, zainstaluj zależności:
```powershell
cd c:\ProjektZaliczeniowy\ola\ola\client
npm install
npm run dev
```

### Backend nie startuje
Sprawdź czy port 5257 jest wolny lub uruchom ponownie:
```powershell
cd c:\ProjektZaliczeniowy\ola\ola
dotnet run
```

### Reset bazy danych
Jeśli masz problemy z bazą danych:
```powershell
cd c:\ProjektZaliczeniowy\ola\ola
dotnet ef database drop --force
dotnet ef database update
```
