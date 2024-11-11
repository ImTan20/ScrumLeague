namespace ScrumLeague.Models
{
	public class Team
	{
		public int Id { get; set; } // Primary Key
		public string Name { get; set; }
		public string Coach { get; set; }
		public int Wins { get; set; }
		public int Losses { get; set; }
		public int Draws { get; set; }
		public int Points { get; set; }
		public int GamesPlayed { get; set; }

        // Navigation properties - made nullable for team creation
        public List<Player>? Players { get; set; } = new List<Player>();
        public List<Match>? HomeMatches { get; set; } = new List<Match>();
        public List<Match>? AwayMatches { get; set; } = new List<Match>();
    }
}