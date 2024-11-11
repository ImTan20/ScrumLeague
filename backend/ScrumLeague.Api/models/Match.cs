using System.Text.Json.Serialization;

namespace ScrumLeague.Models
{
    public class Match
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        //Foreign Keys
        public int HomeTeamId { get; set; }
        public int AwayTeamId { get; set; }

        //Navigation Properties
        [JsonIgnore]
        public Team? HomeTeam { get; set; }
        [JsonIgnore]
        public Team? AwayTeam { get; set; }

        //Scores
        public int HomeScore { get; set; }
        public int AwayScore { get; set; }

        public string Result
        {
            get
            {
                if (HomeScore > AwayScore)
                    return "Home Win";
                if (HomeScore < AwayScore)
                    return "Away Win";
                return "Draw";
            }
        }
    }
}