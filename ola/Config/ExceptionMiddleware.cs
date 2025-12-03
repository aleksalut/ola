using System.Net;
using System.Text.Json;

namespace ola.Config
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                var status = HttpStatusCode.InternalServerError;
                if (ex is Microsoft.Data.SqlClient.SqlException sqlEx && sqlEx.Number == 547) // FK violation
                {
                    status = HttpStatusCode.Conflict;
                }
                context.Response.StatusCode = (int)status;
                context.Response.ContentType = "application/json";
                var payload = JsonSerializer.Serialize(new {
                    error = status == HttpStatusCode.Conflict ? "Data constraint conflict" : "An unexpected error occurred",
                    detail = context.RequestServices.GetService<IHostEnvironment>()?.IsDevelopment() == true ? ex.Message : null
                });
                await context.Response.WriteAsync(payload);
            }
        }
    }
}
