# GitHub Copilot - Instrukcje dla projektu Personal Growth

## Kontekst projektu
To jest aplikacja ASP.NET Core 8.0 do zarządzania rozwojem osobistym:
- **Backend**: ASP.NET Core Web API z JWT authentication
- **Frontend**: React + Vite + TailwindCSS
- **Baza danych**: SQLite (Entity Framework Core)
- **Architektura**: Controller-Service-Repository pattern

## Struktura projektu

### Backend (ola/)
- `Controllers/` - API endpoints
- `Models/` - Entity models (User, Goal, Habit, EmotionEntry, DailyProgress, AuditLog)
- `Services/` - Business logic (ITokenService, IReportsService, IAuditService)
- `Data/` - ApplicationDbContext, EF Core configuration
- `DTOs/` - Data Transfer Objects
- `Auth/` - JWT configuration
- `Config/` - Middleware (ExceptionMiddleware, ValidationFilter)

### Frontend (ola/client/)
- `src/components/` - React components
- `src/services/` - API client services
- `src/pages/` - Page components
- `src/utils/` - Utility functions

## Konwencje kodowania

### C# Backend
```csharp
// Controllers - używaj [ApiController] i routing attributes
[ApiController]
[Route("api/[controller]")]
[Authorize] // gdzie wymagane
public class GoalsController : ControllerBase
{
    private readonly IService _service;
    
    // Async/await dla wszystkich operacji I/O
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GoalDto>>> GetGoals()
    {
        // Implementacja
    }
}

// Services - dependency injection przez constructor
public class GoalsService : IGoalsService
{
    private readonly ApplicationDbContext _context;
    private readonly IAuditService _auditService;
    
    public GoalsService(ApplicationDbContext context, IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }
}

// DTOs - używaj record types dla immutability
public record CreateGoalDto(
    string Title,
    string? Description,
    string WhyReason,
    DateTime? Deadline,
    GoalPriority Priority
);
```

### TypeScript/React Frontend
```typescript
// React components - functional components z hooks
import React, { useState, useEffect } from 'react';

export const GoalsList: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    
    useEffect(() => {
        // Fetch goals
    }, []);
    
    return (/* JSX */);
};

// API services - axios z typami
export const goalsApi = {
    getAll: async (): Promise<Goal[]> => {
        const response = await apiClient.get('/goals');
        return response.data;
    }
};
```

## Modele danych

### Główne encje
- **ApplicationUser** - użytkownik (dziedziczy z IdentityUser)
- **Goal** - cel (Title, Description, WhyReason, Deadline, Priority, Status, ProgressPercentage)
- **Habit** - nawyk (Name, Description, Created)
- **EmotionEntry** - wpis emocji (Date, Emotion/Text, Anxiety/Joy/Anger/Calmness/Boredom)
- **DailyProgress** - postęp dzienny nawyku (HabitId, Date, Value)
- **AuditLog** - audit trail (UserId, Action, EntityType, EntityId, Timestamp, Details)

### Relacje
- User 1:N Goals
- User 1:N Habits
- User 1:N EmotionEntries
- User 1:N DailyProgresses
- Habit 1:N DailyProgresses

## Autoryzacja

### JWT Token
```csharp
// Wymagaj autoryzacji w kontrolerach
[Authorize]
[HttpGet]
public async Task<IActionResult> GetUserData()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    // Implementacja
}

// Role-based authorization
[Authorize(Roles = "Admin")]
[HttpGet("admin/users")]
public async Task<IActionResult> GetAllUsers()
{
    // Tylko dla admina
}
```

### Frontend - axios interceptor
```typescript
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

## Uruchamianie

### Backend
```bash
cd ola
dotnet run
# Aplikacja: http://localhost:5257
# Swagger: http://localhost:5257/swagger
```

### Frontend
```bash
cd ola/client
npm run dev
# Aplikacja: http://localhost:5173
```

### Baza danych
```bash
# Utworzenie/aktualizacja
dotnet ef database update

# Nowa migracja
dotnet ef migrations add NazwaMigracji

# Reset bazy
dotnet ef database drop --force
dotnet ef database update
```

## Dane testowe

### Demo user
- Email: `demo@example.com`
- Hasło: `Demo@123`
- Rola: Admin

## Wskazówki dla Copilot

### Podczas tworzenia nowych features:
1. Dodaj odpowiedni controller w `Controllers/`
2. Utwórz service interface i implementację w `Services/`
3. Dodaj DTOs w `DTOs/`
4. Zarejestruj service w `Program.cs`: `builder.Services.AddScoped<IYourService, YourService>()`
5. Dodaj audit log dla ważnych operacji używając `IAuditService`
6. Użyj `[Authorize]` attribute gdzie potrzebne
7. Zwracaj odpowiednie HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 401 Unauthorized)

### Podczas pracy z Entity Framework:
1. Zawsze używaj async/await: `await _context.SaveChangesAsync()`
2. Używaj Include() dla eager loading: `.Include(g => g.User)`
3. Dodawaj indeksy dla często używanych queries w OnModelCreating
4. Używaj timestamp/datetime w UTC
5. Obsługuj soft delete gdzie sensowne

### Podczas pracy z frontendem:
1. Używaj TypeScript strict mode
2. Twórz reusable components w `src/components/`
3. Centralizuj API calls w `src/services/`
4. Używaj TailwindCSS do stylowania
5. Obsługuj loading states i error states
6. Waliduj dane przed wysłaniem do API

### Bezpieczeństwo:
1. Nigdy nie commituj secrets w kodzie
2. Używaj JWT tylko z HTTPS w produkcji
3. Waliduj wszystkie inputy w kontrolerach
4. Używaj parameterized queries (EF Core robi to automatycznie)
5. Implementuj rate limiting dla login endpoints
6. Hash passwords używając ASP.NET Core Identity

### Testing:
1. Unit tests w projekcie `ola.Tests/`
2. Mockuj dependencies używając Moq
3. Testuj edge cases i error handling
4. Używaj xUnit framework

## Przykładowe zadania

### Dodanie nowego API endpoint:
```csharp
// 1. Model/DTO
public record CreateTaskDto(string Title, DateTime DueDate);

// 2. Service
public interface ITasksService {
    Task<TaskDto> CreateTaskAsync(string userId, CreateTaskDto dto);
}

// 3. Controller
[HttpPost]
public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto dto) {
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var task = await _tasksService.CreateTaskAsync(userId, dto);
    return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
}
```

### Dodanie nowej strony frontendowej:
```typescript
// 1. Page component
export const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    
    useEffect(() => {
        tasksApi.getAll().then(setTasks);
    }, []);
    
    return <div className="container mx-auto p-4">
        {/* Content */}
    </div>;
};

// 2. Routing
<Route path="/tasks" element={<TasksPage />} />
```

## Kontakt i dokumentacja
- Dokumentacja: `/documentation`
- Swagger: `http://localhost:5257/swagger` (w development mode)
- README: `/README.md`
