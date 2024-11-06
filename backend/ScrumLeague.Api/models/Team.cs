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

		//Navigation properties
		public List<Player> Players { get; set; }
		public List<Match> HomeMatches { get; set; }
		public List<Match> AwayMatches { get; set; }
	}
}