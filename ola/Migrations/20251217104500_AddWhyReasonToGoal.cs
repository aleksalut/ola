using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ola.Migrations
{
    /// <inheritdoc />
    public partial class AddWhyReasonToGoal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WhyReason",
                table: "Goals",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WhyReason",
                table: "Goals");
        }
    }
}
