using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ola.Controllers;
using ola.Data;
using ola.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Xunit;

namespace ola.Tests.Controllers
{
    public class ReportsControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new ApplicationDbContext(options);
        }

        private ClaimsPrincipal GetClaimsPrincipal(string userId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            };
            return new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));
        }

        private Mock<IReportsService> GetMockReportsService()
        {
            return new Mock<IReportsService>();
        }

        [Fact]
        public async Task MyStatistics_AuthenticatedUser_ReturnsOkWithStatistics()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var mockReportsService = GetMockReportsService();
            var userId = "test-user-123";

            var expectedStats = new ola.DTOs.Reports.UserStatisticsDto
            {
                TotalGoals = 10,
                CompletedGoals = 7,
                InProgressGoals = 3,
                NotStartedGoals = 0,
                TotalHabits = 5,
                GoalCompletionRate = 70.0m
            };

            mockReportsService
                .Setup(x => x.GetUserStatistics(userId))
                .ReturnsAsync(expectedStats);

            var controller = new ReportsController(mockReportsService.Object, context)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = GetClaimsPrincipal(userId)
                    }
                }
            };

            // Act
            var result = await controller.GetMyStatistics();

            // Assert
            var okResult = Assert.IsType<ActionResult<ola.DTOs.Reports.UserStatisticsDto>>(result);
            var objectResult = Assert.IsType<OkObjectResult>(okResult.Result);
            var stats = Assert.IsType<ola.DTOs.Reports.UserStatisticsDto>(objectResult.Value);
            Assert.Equal(10, stats.TotalGoals);
            Assert.Equal(7, stats.CompletedGoals);
            Assert.Equal(70.0m, stats.GoalCompletionRate);
            mockReportsService.Verify(x => x.GetUserStatistics(userId), Times.Once);
        }

        [Fact]
        public async Task GetCompletionRate_AuthenticatedUser_ReturnsCorrectPercentage()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var mockReportsService = GetMockReportsService();
            var userId = "test-user-456";

            mockReportsService
                .Setup(x => x.GetGoalCompletionRate(userId))
                .ReturnsAsync(85.5m);

            var controller = new ReportsController(mockReportsService.Object, context)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = GetClaimsPrincipal(userId)
                    }
                }
            };

            // Act
            var result = await controller.GetCompletionRate();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = okResult.Value;
            Assert.NotNull(value);
            var completionRate = value.GetType().GetProperty("completionRate")?.GetValue(value);
            Assert.Equal(85.5m, completionRate);
            mockReportsService.Verify(x => x.GetGoalCompletionRate(userId), Times.Once);
        }

        [Fact]
        public async Task MyStatistics_NoUserInContext_ReturnsUnauthorized()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var mockReportsService = GetMockReportsService();

            var controller = new ReportsController(mockReportsService.Object, context)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = new ClaimsPrincipal(new ClaimsIdentity()) // No claims
                    }
                }
            };

            // Act
            var result = await controller.GetMyStatistics();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.NotNull(unauthorizedResult.Value);
            mockReportsService.Verify(x => x.GetUserStatistics(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetCompletionRate_NoUserInContext_ReturnsUnauthorized()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var mockReportsService = GetMockReportsService();

            var controller = new ReportsController(mockReportsService.Object, context)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = new ClaimsPrincipal(new ClaimsIdentity()) // No claims
                    }
                }
            };

            // Act
            var result = await controller.GetCompletionRate();

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.NotNull(unauthorizedResult.Value);
            mockReportsService.Verify(x => x.GetGoalCompletionRate(It.IsAny<string>()), Times.Never);
        }
    }
}
