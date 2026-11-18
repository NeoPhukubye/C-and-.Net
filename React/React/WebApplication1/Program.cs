// Import Entity Framework Core so UseSqlServer is available.
using Microsoft.EntityFrameworkCore;
// Import the models namespace so the DbContext type is in scope.
using WebApplication1.models;

// Create the application builder that reads configuration and registers services.
var builder = WebApplication.CreateBuilder(args);

// Register MVC controllers so attribute-routed API endpoints are discovered.
builder.Services.AddControllers();
// Generate an OpenAPI document for the development environment.
builder.Services.AddOpenApi();
// Return RFC 7807 problem details for unhandled exceptions.
builder.Services.AddProblemDetails();

// Read the SQL Server connection string from configuration.
var connectionString = builder.Configuration.GetConnectionString("DevConnection");
// Fail fast with a clear message when the connection string is missing.
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Connection string 'DevConnection' is missing. Configure it in appsettings.json or user secrets.");
}

// Register the database context and point it at SQL Server.
builder.Services.AddDbContext<DonationDBContext>(options => options.UseSqlServer(connectionString));

// Read the browser origins that are allowed to call this API.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
// Register a CORS policy named "AllowReact".
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        // Fall back to any origin when no list is configured (local development).
        if (allowedOrigins.Length == 0)
        {
            policy.AllowAnyOrigin();
        }
        else
        {
            // Only trust the configured front-end origins in other environments.
            policy.WithOrigins(allowedOrigins);
        }

        // Allow the HTTP verbs and headers used by the React client.
        policy.AllowAnyMethod().AllowAnyHeader();
    });
});

// Build the configured application.
var app = builder.Build();

// Add developer-only endpoints.
if (app.Environment.IsDevelopment())
{
    // Expose the OpenAPI document at /openapi/v1.json.
    app.MapOpenApi();
}
else
{
    // Convert unhandled exceptions into problem details responses.
    app.UseExceptionHandler();
    // Ask browsers to always use HTTPS for this host.
    app.UseHsts();
}

// Apply the CORS policy to every request.
app.UseCors("AllowReact");
// Enable authorization middleware for future protected endpoints.
app.UseAuthorization();
// Map the attribute-routed controllers.
app.MapControllers();

// Start the web server.
app.Run();
