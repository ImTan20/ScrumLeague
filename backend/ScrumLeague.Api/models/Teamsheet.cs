using ScrumLeague.Models;
using System.Text.Json.Serialization;

namespace ScrumLeague.Models
{
    public class Teamsheet
    {
        public int Id { get; set; } // Primary Key
        public int TeamId { get; set; } // Foreign Key
        [JsonIgnore]
        public Team? Team { get; set; } // Navigation property

        // List of players assigned to this teamsheet
        public List<TeamsheetPlayer> Players { get; set; } = new List<TeamsheetPlayer>();
    }
}