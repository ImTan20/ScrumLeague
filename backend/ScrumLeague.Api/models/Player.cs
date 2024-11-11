using System.ComponentModel.DataAnnotations;

namespace ScrumLeague.Models
{
    public class Player
    {
        public int Id { get; set; }

        //Limit character length to 50
        [MaxLength(50)]
        public string FirstName { get; set; }

        [MaxLength(50)]
        public string LastName { get; set; }

        [MaxLength(50)]
        public string Position { get; set; }
        public int Tries { get; set; }
        public int Tackles { get; set; }
        public int Carries { get; set; }
        //Foreign Key
        public int TeamId { get; set; }
        //Navigation Property
        public Team? Team { get; set; }
    }
}

