using Microsoft.EntityFrameworkCore;
using ScrumLeague.Models;

namespace ScrumLeague.Data
{
	public class ScrumLeagueDbContext : DbContext
	{
		public ScrumLeagueDbContext(DbContextOptions<ScrumLeagueDbContext> options)
			: base(options)
		{
		}

		// DbSets for each entity representing the tables in the database
		public DbSet<Team> Teams { get; set; }
		public DbSet<Player> Players { get; set; }
		public DbSet<Match> Matches { get; set; }
        public DbSet<Teamsheet> Teamsheets { get; set; }
		public DbSet<TeamsheetPlayer> TeamsheetPlayer { get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
            // Configure the relationship between Match and Team (HomeTeam)
            modelBuilder.Entity<Match>()
				.HasOne(m => m.HomeTeam)  // Match has one HomeTeam
				.WithMany(t => t.HomeMatches)  // Team has many HomeMatches
				.HasForeignKey(m => m.HomeTeamId)  // HomeTeamId is the foreign key in Match
				.OnDelete(DeleteBehavior.Restrict); // Prevents cascading delete for hometeamid

			// Configure the relationship between Match and Team (AwayTeam)
			modelBuilder.Entity<Match>()
				.HasOne(m => m.AwayTeam)  // Match has one AwayTeam
				.WithMany(t => t.AwayMatches)  // Team has many AwayMatches
				.HasForeignKey(m => m.AwayTeamId)  // AwayTeamId is the foreign key in Match
				.OnDelete(DeleteBehavior.Restrict); // Prevents cascading delete for awayteamid

            base.OnModelCreating(modelBuilder);
		}
	}
}