using Microsoft.EntityFrameworkCore;
using ScrumLeague.Data;
using ScrumLeague.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add controllers (needed for API endpoints)
builder.Services.AddControllers();

// Configure DbContext with SQL Server connection string
builder.Services.AddDbContext<ScrumLeagueDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add routing middleware for API controller endpoints
app.MapControllers(); // This maps the controllers for API endpoints

app.Run();
