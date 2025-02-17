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
    public class TeamsheetsController : ControllerBase
    {
        private readonly ScrumLeagueDbContext _context;

        public TeamsheetsController(ScrumLeagueDbContext context)
        {
            _context = context;
        }

        // GET: api/Teamsheet ALL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teamsheet>>> GetTeamsheets()
        {
            try
            {
                var teamsheets = await _context.Teamsheets
                    .Include(t => t.Players)
                    .ThenInclude(tp => tp.Player)
                    .ToListAsync();

                return Ok(teamsheets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the teamsheets", Error = ex.Message });
            }
        }

        // GET: api/Teamsheet/{id} SPECIFIC
        [HttpGet("{id}")]
        public async Task<ActionResult<Teamsheet>> GetTeamsheet(int id)
        {
            try
            {
                var teamsheet = await _context.Teamsheets
                    .Include(t => t.Players)
                    .ThenInclude(tp => tp.Player)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (teamsheet == null)
                {
                    return NotFound(new { Message = "Teamsheet not found" });
                }

                return Ok(teamsheet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the teamsheet", Error = ex.Message });
            }
        }

        // POST: api/Teamsheet
        [HttpPost]
        public async Task<ActionResult<Teamsheet>> CreateTeamsheet(Teamsheet teamsheet)
        {
        
            if (teamsheet.TeamId <= 0)
            {
                return BadRequest(new { Message = "Invalid TeamId" });
            }
            try
            {
                _context.Teamsheets.Add(teamsheet);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTeamsheet), new { id = teamsheet.Id }, teamsheet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while creating the teamsheet", Error = ex.Message });
            }
        }

        // PUT: api/Teamsheet/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeamsheet(int id, Teamsheet updatedTeamsheet)
        {
            updatedTeamsheet.Id = id;

            try
            {
                // Remove existing players and replace with the updated list
                var existingPlayers = _context.TeamsheetPlayer.Where(tp => tp.TeamsheetId == id);
                _context.TeamsheetPlayer.RemoveRange(existingPlayers);

                // Add updated players
                _context.TeamsheetPlayer.AddRange(updatedTeamsheet.Players);

                // Update the teamsheet itself
                _context.Entry(updatedTeamsheet).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred.", Error = ex.Message });
            }

            return NoContent();
        }

        // DELETE: api/Teamsheet/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeamsheet(int id)
        {
            var teamsheet = await _context.Teamsheets.FindAsync(id);
            if (teamsheet == null)
            {
                return NotFound(new { Message = "Teamsheet not found" });
            }
            try
            {
                // Delete Teamsheet players from table relating to the teamsheet
                var relatedPlayers = _context.TeamsheetPlayer.Where(tp => tp.TeamsheetId == id);
                _context.TeamsheetPlayer.RemoveRange(relatedPlayers);
                await _context.SaveChangesAsync();
                // Remove teamsheet
                _context.Teamsheets.Remove(teamsheet);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while deleting the teamsheet", Error = ex.Message });
            }
            return NoContent();
        }
    }
}
