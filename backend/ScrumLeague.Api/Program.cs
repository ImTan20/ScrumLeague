using Microsoft.EntityFrameworkCore;
using ScrumLeague.Data;
using ScrumLeague.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Register Swagger generator for API documentation

// Add controllers (needed for API endpoints)
builder.Services.AddControllers();

// Configure DbContext with SQL Server connection string
builder.Services.AddDbContext<ScrumLeagueDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins("https://your-frontend-url.com") // temporary, replace with actual frontend URL
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enable Swagger JSON endpoint
    app.UseSwaggerUI(c =>  // Configure Swagger UI
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ScrumLeague API V1"); // Custom endpoint name and version
        c.RoutePrefix = string.Empty; // Set Swagger UI to load at the app's root URL
    });
}

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

// Enable CORS with the specified policy
app.UseCors("AllowSpecificOrigins"); // Apply the CORS policy

// Map controllers for API routes, routing middleware
app.MapControllers();

app.Run();
