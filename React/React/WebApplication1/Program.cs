using Microsoft.EntityFrameworkCore;
using WebApplication1.models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Register DonationDBContext with SQL Server Express
builder.Services.AddDbContext<DonationDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DevConnection")));

// Enable CORS for React frontend requests
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReact");

app.UseAuthorization();

app.MapControllers();

app.Run();