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
    public class MatchesController : ControllerBase
    {
        private readonly ScrumLeagueDbContext _context;

        public MatchesController(ScrumLeagueDbContext context)
        {
            _context = context;
        }

        // GET: api/Matches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatches()
        {
            try
            {
                var matches = await _context.Matches
                    .Include(m => m.HomeTeam)
                    .Include(m => m.AwayTeam)
                    .ToListAsync();
                return Ok(matches); // Return matches with team details
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the matches", Error = ex.Message });
            }
        }

        // GET: api/Matches/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Match>> GetMatch(int id)
        {
            try
            {
                var match = await _context.Matches
                    .Include(m => m.HomeTeam)
                    .Include(m => m.AwayTeam)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (match == null)
                {
                    return NotFound(new { Message = "Match not found" });
                }

                return Ok(match); // Return the match with team details
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching the match", Error = ex.Message });
            }
        }

        // POST: api/Matches
        [HttpPost]
        public async Task<ActionResult<Match>> CreateMatch(Match match)
        {
            // Validate HomeTeamId and AwayTeamId
            var homeTeamExists = await _context.Teams.AnyAsync(t => t.Id == match.HomeTeamId);
            var awayTeamExists = await _context.Teams.AnyAsync(t => t.Id == match.AwayTeamId);
            if (!homeTeamExists || !awayTeamExists)
            {
                return BadRequest(new { Message = "Invalid HomeTeamId or AwayTeamId" });
            }

            try
            {
                _context.Matches.Add(match);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetMatch), new { id = match.Id }, match); // Return 201 created response
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while creating the match", Error = ex.Message });
            }
        }

        // PUT: api/Matches/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMatch(int id, Match match)
        {
            if (id != match.Id)
            {
                return BadRequest(new { Message = "ID in the path does not match ID in the match data" });
            }

            // Validate HomeTeamId and AwayTeamId
            var homeTeamExists = await _context.Teams.AnyAsync(t => t.Id == match.HomeTeamId);
            var awayTeamExists = await _context.Teams.AnyAsync(t => t.Id == match.AwayTeamId);
            if (!homeTeamExists || !awayTeamExists)
            {
                return BadRequest(new { Message = "Invalid HomeTeamId or AwayTeamId" });
            }

            _context.Entry(match).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Matches.Any(e => e.Id == id))
                {
                    return NotFound(new { Message = "Match not found" });
                }
                else
                {
                    return StatusCode(500, new { Message = "A concurrency error occurred while updating the match" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the match", Error = ex.Message });
            }

            return NoContent(); // Successfully updated
        }

        // DELETE: api/Matches/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null)
            {
                return NotFound(new { Message = "Match not found" });
            }

            try
            {
                _context.Matches.Remove(match);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while deleting the match", Error = ex.Message });
            }

            return NoContent(); // Successfully deleted
        }
    }
}
