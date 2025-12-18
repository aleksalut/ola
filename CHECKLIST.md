# ✅ Checklist Uruchomienia - Personal Growth App

## Przed uruchomieniem - sprawdź:

### 1. Wymagane oprogramowanie
- [ ] .NET SDK 8.0+ zainstalowany (`dotnet --version`)
- [ ] Node.js 18+ zainstalowany (`node --version`)
- [ ] SQL Server Express zainstalowany i uruchomiony (`Get-Service "MSSQL$SQLEXPRESS"`)
- [ ] Git zainstalowany (opcjonalnie)

### 2. Pierwsza konfiguracja
- [ ] Sklonowany/pobrany projekt
- [ ] Otwarto katalog projektu w PowerShell/Terminal
- [ ] Ustawiono ExecutionPolicy: `Set-ExecutionPolicy -Bypass -Scope Process`

### 3. Baza danych
- [ ] Utworzono migrację: `cd ola; dotnet ef migrations add InitialCreate`
- [ ] Zastosowano migrację: `dotnet ef database update`
- [ ] Brak błędów podczas tworzenia bazy

### 4. Uruchomienie aplikacji

**Opcja A - Automatyczna (zalecana dla początkujących):**
- [ ] Uruchomiono: `.\start-app.ps1`
- [ ] Backend wystartował w osobnym oknie
- [ ] Frontend wystartował w osobnym oknie
- [ ] Przeglądarka otworzyła się automatycznie

**Opcja B - Manualna (dla zaawansowanych):**
- [ ] Pierwsze okno PowerShell: `cd ola; dotnet run`
- [ ] Backend działa na http://localhost:5257
- [ ] Drugie okno PowerShell: `cd ola\client; npm install; npm run dev`
- [ ] Frontend działa na http://localhost:5173

### 5. Weryfikacja
- [ ] Otwarto http://localhost:5173 w przeglądarce
- [ ] Strona logowania się wyświetla
- [ ] Zalogowano się jako `admin@admin.com` / `Adusia2025$#`
- [ ] Panel główny aplikacji działa

### 6. Import danych testowych (opcjonalnie)
- [ ] Przeszedłem do: `cd Dokumentacja\manual`
- [ ] Uruchomiono: `.\import-data.ps1`
- [ ] Zaimportowano 10 celów, 10 nawyków, 14 emocji
- [ ] Zalogowano jako `test@test.com` / `Test@123`
- [ ] Dane testowe widoczne w aplikacji

---

## 🚨 Częste problemy - szybkie rozwiązania

| Problem | Rozwiązanie |
|---------|-------------|
| "Scripts is disabled" | `Set-ExecutionPolicy -Bypass -Scope Process -Force` |
| Backend nie startuje | Sprawdź czy jesteś w katalogu `ola` |
| Port zajęty (5257/5173) | `Get-Process dotnet,node \| Stop-Process -Force` |
| Baza nie istnieje | `dotnet ef migrations add InitialCreate; dotnet ef database update` |
| SQL Server nie działa | `Start-Service "MSSQL$SQLEXPRESS"` |
| npm install fails | `Remove-Item -Recurse node_modules; npm install` |
| Błąd logowania | Użyj `admin@admin.com` / `Adusia2025$#` |

---

## 📞 Potrzebujesz pomocy?

1. **Pełna instrukcja:** `Dokumentacja\manual\INSTRUKCJA_URUCHOMIENIA.md`
2. **Szybki start:** `SZYBKI_START.md`
3. **Główny README:** `README.md`
4. **Swagger API:** http://localhost:5257/swagger (gdy backend działa)

---

**Wszystko działa? Świetnie! 🎉 Możesz zacząć korzystać z aplikacji!**
