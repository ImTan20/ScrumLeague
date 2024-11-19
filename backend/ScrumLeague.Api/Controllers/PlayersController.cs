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
    public class PlayersController : ControllerBase
    {
        private readonly ScrumLeagueDbContext _context;

        public PlayersController(ScrumLeagueDbContext context)
        {
            _context = context;
        }

        // GET: api/Players
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Player>>> GetPlayers()
        {
            try
            {
                var players = await _context.Players.Include(p => p.Team).ToListAsync();
                return Ok(players); // Return players with team details
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the players", Error = ex.Message });
            }
        }

        // GET: api/Players/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> GetPlayer(int id)
        {
            try
            {
                var player = await _context.Players.Include(p => p.Team).FirstOrDefaultAsync(p => p.Id == id);

                if (player == null)
                {
                    return NotFound(new { Message = "Player not found" });
                }

                return Ok(player); // Return the player with team details
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the player", Error = ex.Message });
            }
        }

        // POST: api/Players
        [HttpPost]
        public async Task<ActionResult<Player>> CreatePlayer(Player player)
        {
            // Validate if the team exists
            var teamExists = await _context.Teams.AnyAsync(t => t.Id == player.TeamId);
            if (!teamExists)
            {
                return BadRequest(new { Message = "Invalid TeamId" });
            }

            try
            {
                _context.Players.Add(player);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetPlayer), new { id = player.Id }, player); // Return 201 created response
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while creating the player", Error = ex.Message });
            }
        }

        // PUT: api/Players/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlayer(int id, Player player)
        {
            if (id != player.Id)
            {
                return BadRequest(new { Message = "ID in the path does not match ID in the player data" });
            }

            // Validate if the team exists
            var teamExists = await _context.Teams.AnyAsync(t => t.Id == player.TeamId);
            if (!teamExists)
            {
                return BadRequest(new { Message = "Invalid TeamId" });
            }

            _context.Entry(player).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Players.Any(e => e.Id == id))
                {
                    return NotFound(new { Message = "Player not found" });
                }
                else
                {
                    return StatusCode(500, new { Message = "A concurrency error occurred while updating the player" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the player", Error = ex.Message });
            }

            return NoContent(); // Successfully updated
        }

        // DELETE: api/Players/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlayer(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null)
            {
                return NotFound(new { Message = "Player not found" });
            }

            try
            {
                _context.Players.Remove(player);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while deleting the player", Error = ex.Message });
            }

            return NoContent(); // Successfully deleted
        }

        // GET: api/Players/{id}/stats
        [HttpGet("{id}/stats")]
        public async Task<ActionResult<Player>> GetPlayerStats(int id)
        {
            try
            {
                var player = await _context.Players
                    .Include(p => p.Team)  // If I include the player's team as well
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (player == null)
                {
                    return NotFound(new { Message = "Player not found" });
                }

                // Directly return the player's stats
                var stats = new
                {
                    GamesPlayed = player.Team.GamesPlayed,
                    Tries = player.Tries,
                    Tackles = player.Tackles,
                    Carries = player.Carries
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the player stats", Error = ex.Message });
            }
        }
    }
}
