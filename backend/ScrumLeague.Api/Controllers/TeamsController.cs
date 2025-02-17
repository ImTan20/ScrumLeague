using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScrumLeague.Data;
using ScrumLeague.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScrumLeague.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly ScrumLeagueDbContext _context;

        public TeamsController(ScrumLeagueDbContext context)
        {
            _context = context;
        }

        // GET: api/Teams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
        {
            try
            {
                var teams = await _context.Teams.ToListAsync();
                return Ok(teams); // Return all teams
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the teams", Error = ex.Message });
            }
        }

        // GET: api/Teams/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            try
            {
                var team = await _context.Teams.FindAsync(id);
                if (team == null)
                {
                    return NotFound(new { Message = "Team not found" });
                }

                return Ok(team); // Return the team
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the team", Error = ex.Message });
            }
        }

        // POST: api/Teams
        [HttpPost]
        public async Task<ActionResult<Team>> CreateTeam(Team team)
        {
            // Validate that team name is not null or empty
            if (string.IsNullOrWhiteSpace(team.Name))
            {
                return BadRequest(new { Message = "Team name cannot be empty" });
            }

            try
            {
                _context.Teams.Add(team);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, team); // Return 201 created response
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while creating the team", Error = ex.Message });
            }
        }

        // PUT: api/Teams/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeam(int id, Team team)
        {
            if (id != team.Id)
            {
                return BadRequest(new { Message = "ID in the path does not match ID in the team data" });
            }

            // Validate that team name is not null or empty
            if (string.IsNullOrWhiteSpace(team.Name))
            {
                return BadRequest(new { Message = "Team name cannot be empty" });
            }

            _context.Entry(team).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Teams.Any(e => e.Id == id))
                {
                    return NotFound(new { Message = "Team not found" });
                }
                else
                {
                    return StatusCode(500, new { Message = "A concurrency error occurred while updating the team" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the team", Error = ex.Message });
            }

            return NoContent(); // Successfully updated
        }

        // DELETE: api/Teams/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeam(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound(new { Message = "Team not found" });
            }

            try
            {
                _context.Teams.Remove(team);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while deleting the team", Error = ex.Message });
            }

            return NoContent(); // Successfully deleted
        }

        // GET: api/Teams/{id}/stats
        [HttpGet("{id}/stats")]
        public async Task<ActionResult> GetTeamStats(int id)
        {
            try
            {
                var team = await _context.Teams
                    .Include(t => t.Players)  // Include players to calculate player-based stats
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (team == null)
                {
                    return NotFound(new { Message = "Team not found" });
                }

                // Calculate player stats (aggregates)
                var players = team.Players ?? new List<Player>();
                var playerStats = new
                {
                    TotalTries = players.Sum(p => p.Tries),
                    TotalTackles = players.Sum(p => p.Tackles),
                    TotalCarries = players.Sum(p => p.Carries),
                    AverageTries = team.GamesPlayed > 0
                        ? Math.Round(players.Sum(p => p.Tries) / (double)team.GamesPlayed, 2)
                        : 0,
                    AverageTackles = team.GamesPlayed > 0
                        ? Math.Round(players.Sum(p => p.Tackles) / (double)team.GamesPlayed, 2)
                        : 0,
                    AverageCarries = team.GamesPlayed > 0
                        ? Math.Round(players.Sum(p => p.Carries) / (double)team.GamesPlayed, 2)
                        : 0,
                    TopTryScorer = players.OrderByDescending(p => p.Tries).FirstOrDefault()
                };

                // Team-specific stats
                var teamData = new
                {
                    Wins = team.Wins,
                    Losses = team.Losses,
                    Draws = team.Draws,
                    Points = team.Points,
                    GamesPlayed = team.GamesPlayed
                };

                // Combine both player stats and team data in one response
                var combinedStats = new
                {
                    PlayerStats = playerStats,
                    TeamStats = teamData
                };

                return Ok(combinedStats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the team stats", Error = ex.Message });
            }
        }
    }
}
