# Backup i Zarządzanie Danymi

## Lokalizacja bazy danych
- **Plik**: `ola/GrowthDb.db` (SQLite)
- **Rozmiar**: ~300 KB
- **Format**: SQLite 3

## Tworzenie backupu

### Ręczny backup (PowerShell)
```powershell
cd C:\projektyOla\ola\ola
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "C:\projektyOla\ola\Database\backups"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Copy-Item -Path "GrowthDb.db" -Destination "$backupDir\GrowthDb_$timestamp.db"
```

### Lokalizacja backupów
```
ola/Database/backups/
├── GrowthDb_2025-12-18_20-30-00.db
├── GrowthDb_2025-12-18_19-15-00.db
└── ...
```

## Aktualny stan danych (2025-12-18)

### Użytkownik testowy
- **Email**: test@test.com
- **Hasło**: Test@123
- **Rola**: Admin
- **ID**: e02cfb93-7091-401f-a5e0-431a9603d1cf

### Cele (Goals) - 6 sztuk
| ID | Tytuł | Postęp | Status | Deadline |
|----|-------|--------|--------|----------|
| 6 | Nauczyć się TypeScript | 80% | In Progress | 2025-06-30 |
| 5 | 20 pompek za jednym podejściem | 60% | In Progress | 2026-01-31 |
| 8 | Ukończyć maraton | 45% | In Progress | 2025-10-15 |
| 4 | 10 podciągnięć | 35% | In Progress | 2026-01-31 |
| 9 | Nauczyć się gitary | 25% | In Progress | 2025-05-31 |
| 7 | Napisać książkę | 15% | In Progress | 2026-12-31 |

### Nawyki (Habits) - 5 sztuk
| ID | Nazwa | Wpisy postępu | Średnia | Okres |
|----|-------|---------------|---------|-------|
| 5 | Jogga 30 min | 31 | 72.7% | 30 dni |
| 4 | Medytacja | 31 | 75.2% | 30 dni |
| 6 | Nauka języka | 31 | 76.0% | 30 dni |
| 7 | Pisanie dziennika | 31 | 77.0% | 30 dni |
| 8 | Zdrowe śniadanie | 31 | 72.4% | 30 dni |

**Łącznie**: 155 wpisów daily progress (31 dni × 5 nawyków)

### Wpisy emocji (Emotion Entries) - 14 sztuk
Okres: 2025-12-08 do 2025-12-18 (10 dni)

Przykładowe emocje:
- Radość, Spokój, Złość, Smutek, Nuda
- Z ocenami: Anxiety (1-10), Joy (1-10), Anger (1-10), Calmness (1-10), Boredom (1-10)

### Statystyki ogólne
- **Użytkownicy**: 1 (test@test.com)
- **Cele**: 6 (wszystkie w trakcie realizacji)
- **Nawyki**: 5 (aktywnie śledzone)
- **Wpisy postępu**: 155+
- **Wpisy emocji**: 14
- **Logi audytowe**: ~200+

## Przywracanie z backupu

### Krok 1: Zatrzymaj aplikację
```bash
# Zatrzymaj backend jeśli działa
# Ctrl+C w terminalu z dotnet run
```

### Krok 2: Zastąp bazę danych
```powershell
cd C:\projektyOla\ola\ola
# Usuń obecną bazę
Remove-Item GrowthDb.db

# Przywróć z backupu
Copy-Item "C:\projektyOla\ola\Database\backups\GrowthDb_2025-12-18_20-30-00.db" -Destination "GrowthDb.db"
```

### Krok 3: Uruchom ponownie
```bash
dotnet run
```

## Reset bazy danych

### Pełny reset (usuwa wszystkie dane!)
```bash
cd ola
dotnet ef database drop --force
dotnet ef database update
```

Po resecie baza będzie pusta - trzeba będzie dodać dane demo lub przywrócić z backupu.

## Import danych z SQL

### Z pliku backup_data.sql
```bash
# W przyszłości - gdy sqlite3 będzie dostępny
sqlite3 GrowthDb.db < ../Database/backup_data.sql
```

### Przez Entity Framework
Seed data są automatycznie dodawane przy migracji:
- Użytkownik test@test.com
- Role Admin/User
- Przykładowe cele i nawyki

## Najlepsze praktyki

### Przed zmianami w schemacie
1. Zrób backup bazy danych
2. Sprawdź obecne migracje: `dotnet ef migrations list`
3. Dodaj nową migrację: `dotnet ef migrations add NazwaMigracji`
4. Zaktualizuj bazę: `dotnet ef database update`

### Regularne backupy
Zalecane przed:
- Zmianami w schemacie bazy
- Testowaniem nowych funkcji
- Populowaniem dużej ilości danych
- Deploymentem do produkcji

### Monitoring rozmiaru bazy
```powershell
Get-Item C:\projektyOla\ola\ola\GrowthDb.db | Select-Object Name, Length, LastWriteTime
```

## Troubleshooting

### Baza jest zablokowana
```
Error: database is locked
```
**Rozwiązanie**: Zatrzymaj wszystkie instancje aplikacji i spróbuj ponownie.

### Migracje nie działają
```bash
# Usuń bazę i utwórz od nowa
dotnet ef database drop --force
dotnet ef database update
```

### Brakuje danych testowych
```bash
# Przywróć z backupu lub uruchom ponownie aplikację
# Seed data są dodawane automatycznie przy pierwszym uruchomieniu
```

## Kontakt
W przypadku problemów sprawdź:
- `README.md` - główna dokumentacja
- `documentation/JAK_URUCHOMIC_APLIKACJE.md` - przewodnik uruchamiania
- Logi aplikacji w konsoli
