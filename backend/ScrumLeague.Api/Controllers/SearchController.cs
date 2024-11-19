using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScrumLeague.Data;
using ScrumLeague.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScrumLeague.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ScrumLeagueDbContext _context;

        public SearchController(ScrumLeagueDbContext context)
        {
            _context = context;
        }

        // GET: api/Search?query=value
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> SearchEntities([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { Message = "Query cannot be empty" });
            }

            try
            {
                // Fetch players matching the query
                var players = await _context.Players
                    .Where(p => EF.Functions.Like(p.FirstName + " " + p.LastName, $"%{query}%"))
                    .Select(p => new
                    {
                        p.Id,
                        Name = p.FirstName + " " + p.LastName,
                        Type = "Player"
                    })
                    .ToListAsync();

                // Fetch teams matching the query
                var teams = await _context.Teams
                    .Where(t => EF.Functions.Like(t.Name, $"%{query}%"))
                    .Select(t => new
                    {
                        t.Id,
                        t.Name,
                        Type = "Team"
                    })
                    .ToListAsync();

                // Combine and sort results
                var combinedResults = players.Concat(teams).OrderBy(e => e.Name).ToList();

                return Ok(combinedResults);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while searching", Error = ex.Message });
            }
        }

        // Optional: Define endpoint for detailed entity retrieval
        // GET: api/Search/{id}?type=Player or Team
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetEntityDetails(int id, [FromQuery] string type)
        {
            if (string.IsNullOrWhiteSpace(type))
            {
                return BadRequest(new { Message = "Type parameter is required (Player or Team)" });
            }

            try
            {
                if (type.Equals("Player", StringComparison.OrdinalIgnoreCase))
                {
                    var player = await _context.Players
                        .Include(p => p.Team) // Include Team details if needed
                        .FirstOrDefaultAsync(p => p.Id == id);

                    if (player == null)
                    {
                        return NotFound(new { Message = "Player not found" });
                    }

                    return Ok(new
                    {
                        player.Id,
                        Name = player.FirstName + " " + player.LastName,
                        player.Position,
                        player.Tries,
                        player.Tackles,
                        player.Carries,
                        TeamName = player.Team?.Name
                    });
                }
                else if (type.Equals("Team", StringComparison.OrdinalIgnoreCase))
                {
                    var team = await _context.Teams
                        .Include(t => t.Players) // Include Players if needed
                        .FirstOrDefaultAsync(t => t.Id == id);

                    if (team == null)
                    {
                        return NotFound(new { Message = "Team not found" });
                    }

                    return Ok(new
                    {
                        team.Id,
                        team.Name,
                        Wins = team.Wins,
                        Losses = team.Losses,
                        Draws = team.Draws,
                        Points = team.Points,
                        Players = team.Players.Select(p => new
                        {
                            p.Id,
                            Name = p.FirstName + " " + p.LastName
                        }).ToList()
                    });
                }

                return BadRequest(new { Message = "Invalid type parameter. Expected 'Player' or 'Team'." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the entity details", Error = ex.Message });
            }
        }
    }
}
