using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ScrumLeague.Models
{
    public class Player
    {
        public int Id { get; set; }

        //Limit character length to 50
        [MaxLength(50)]
        public required string FirstName { get; set; }

        [MaxLength(50)]
        public required string LastName { get; set; }

        [MaxLength(50)]
        public required string Position { get; set; }
        public int Tries { get; set; }
        public int Tackles { get; set; }
        public int Carries { get; set; }
        //Foreign Key
        public int TeamId { get; set; }
        //Navigation Property
        [JsonIgnore]
        public Team? Team { get; set; }
        [JsonIgnore]
        public List<TeamsheetPlayer>? TeamsheetPlayers { get; set; } = new List<TeamsheetPlayer>();
    }
}

