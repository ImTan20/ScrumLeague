using ScrumLeague.Models;
using System.Text.Json.Serialization;

namespace ScrumLeague.Models
{
    public class TeamsheetPlayer
    {
        public int Id { get; set; } // Primary Key

        // Foreign Keys
        public int TeamsheetId { get; set; }
        public int TeamId { get; set; }  // Foreign Key to Teamsheet
        public int PlayerId { get; set; }     // Foreign Key to Player
        public string? AssignedPosition { get; set; }

        // Navigation Properties
        [JsonIgnore]
        public Teamsheet? Teamsheet { get; set; }
        [JsonIgnore]
        public Player? Player { get; set; }
    }
}