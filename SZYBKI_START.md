# ⚡ Szybki Start - Personal Growth App

## 🎯 Uruchomienie w 5 minut

### 1️⃣ Sprawdź wymagania
```powershell
dotnet --version      # Powinno być 8.0+
node --version        # Powinno być 18+
Get-Service "MSSQL`$SQLEXPRESS"  # Status: Running
```

### 2️⃣ Utwórz bazę danych
```powershell
cd ola
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 3️⃣ Uruchom aplikację
**Otwórz PIERWSZE okno PowerShell:**
```powershell
cd ola
dotnet run
```
✅ Backend: http://localhost:5257

**Otwórz DRUGIE okno PowerShell:**
```powershell
cd ola\client
npm install
npm run dev
```
✅ Frontend: http://localhost:5173

### 4️⃣ Zaloguj się
- **Email:** `admin@admin.com`
- **Hasło:** `Adusia2025$#`

## 📊 Import danych testowych (opcjonalnie)

```powershell
cd Dokumentacja\manual
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\import-data.ps1
```

Po imporcie zaloguj się:
- **Email:** `test@test.com`
- **Hasło:** `Test@123`

Zaimportowane dane:
- ✅ 10 celów
- ✅ 10 nawyków
- ✅ 14 wpisów emocji
- ✅ 70 wpisów postępu

---

## 🚨 Najczęstsze problemy

### Backend nie startuje
```powershell
# Upewnij się, że jesteś w katalogu 'ola'
cd ola
dotnet run
```

### "Scripts is disabled"
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```

### Port zajęty
```powershell
Get-Process -Name "dotnet", "node" | Stop-Process -Force
```

### Baza nie istnieje
```powershell
cd ola
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 📖 Pełna dokumentacja
Zobacz: `Dokumentacja\manual\INSTRUKCJA_URUCHOMIENIA.md`

---

**Powodzenia! 🎉**
