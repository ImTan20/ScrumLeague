using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScrumLeague.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTeamsheetSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Date",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Teamsheets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TeamId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teamsheets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Teamsheets_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeamsheetPlayer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    PlayerId = table.Column<int>(type: "int", nullable: false),
                    TeamsheetId = table.Column<int>(type: "int", nullable: true),
                    AssignedPosition = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamsheetPlayer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamsheetPlayer_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeamsheetPlayer_Teamsheets_TeamsheetId",
                        column: x => x.TeamsheetId,
                        principalTable: "Teamsheets",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeamsheetPlayer_PlayerId",
                table: "TeamsheetPlayer",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamsheetPlayer_TeamsheetId",
                table: "TeamsheetPlayer",
                column: "TeamsheetId");

            migrationBuilder.CreateIndex(
                name: "IX_Teamsheets_TeamId",
                table: "Teamsheets",
                column: "TeamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeamsheetPlayer");

            migrationBuilder.DropTable(
                name: "Teamsheets");

            migrationBuilder.AlterColumn<string>(
                name: "Date",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
