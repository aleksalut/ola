# Ola - Personal Growth API

A .NET 8 Web API for tracking personal growth, habits, goals, and emotions.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Habit Tracking**: Create and track daily habits with progress monitoring
- **Goal Management**: Set goals with priorities, deadlines, and status tracking
- **Emotion Journal**: Record daily emotions with intensity levels and notes
- **Daily Progress**: Track daily progress on habits

## Tech Stack

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- ASP.NET Core Identity
- JWT Authentication
- Swagger/OpenAPI

## Getting Started

### Prerequisites

- .NET 8 SDK
- SQL Server (or SQL Server LocalDB)

### Running the Application

1. Clone the repository
2. Navigate to the `ola` directory
3. Update the connection string in `appsettings.json` if needed
4. Run the application:

```bash
cd ola
dotnet run
```

The API will be available at `http://localhost:5000` (or the configured port).

### API Documentation

When running in development mode, Swagger UI is available at `/swagger`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile

### Habits
- `GET /api/habits` - List all habits
- `GET /api/habits/{id}` - Get a specific habit
- `POST /api/habits` - Create a new habit
- `PUT /api/habits/{id}` - Update a habit
- `DELETE /api/habits/{id}` - Delete a habit
- `GET /api/habits/{habitId}/progress` - Get progress for a habit
- `POST /api/habits/progress` - Add progress entry (also available at `POST /api/progress`)

### Goals
- `GET /api/goals` - List all goals
- `GET /api/goals/{id}` - Get a specific goal
- `POST /api/goals` - Create a new goal
- `PUT /api/goals/{id}` - Update a goal
- `DELETE /api/goals/{id}` - Delete a goal
- `PATCH /api/goals/{id}/progress` - Update goal progress
- `PATCH /api/goals/{id}/status` - Update goal status

### Emotion Entries
- `GET /api/emotionentries` - List all emotion entries
- `GET /api/emotionentries/{id}` - Get a specific entry
- `POST /api/emotionentries` - Create a new entry
- `PUT /api/emotionentries/{id}` - Update an entry
- `DELETE /api/emotionentries/{id}` - Delete an entry

## Making This Repository Public

If you want to make this repository public on GitHub:

1. Go to the repository page on GitHub
2. Click on the **Settings** tab
3. Scroll down to the **Danger Zone** section
4. Click **Change visibility**
5. Select **Make public**
6. Confirm by typing the repository name
7. Click the confirmation button

⚠️ **Before making public**, ensure you:
- Remove any sensitive information (API keys, passwords)
- Review configuration files for secrets
- Add a LICENSE file if desired

## License

This project is private. Add a LICENSE file if you wish to specify usage terms.
