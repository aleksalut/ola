using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ola.Controllers;
using ola.Data;
using ola.Models;
using System.Security.Claims;
using Xunit;

namespace ola.Tests.Controllers
{
    public class GoalsControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new ApplicationDbContext(options);
        }

        private UserManager<ApplicationUser> GetMockUserManager(ApplicationDbContext context)
        {
            var store = new Microsoft.AspNetCore.Identity.EntityFrameworkCore.UserStore<ApplicationUser>(context);
            var userManager = new UserManager<ApplicationUser>(
                store,
                null!,
                new PasswordHasher<ApplicationUser>(),
                null!,
                null!,
                null!,
                null!,
                null!,
                null!
            );
            return userManager;
        }

        private ClaimsPrincipal GetClaimsPrincipal(string userId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            };
            return new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));
        }

        [Fact]
        public async Task Create_ValidGoal_ReturnsCreatedAtAction()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var userId = "test-user-123";

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = "test@test.com",
                Email = "test@test.com"
            };
            await userManager.CreateAsync(user);

            var controller = new GoalsController(context, userManager)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = GetClaimsPrincipal(userId)
                    }
                }
            };

            var request = new GoalsController.GoalCreateRequest
            {
                Title = "Test Goal",
                Description = "Test Description",
                Priority = GoalPriority.Medium
            };

            // Act
            var result = await controller.Create(request);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(GoalsController.GetById), createdResult.ActionName);
            var goal = Assert.IsType<Goal>(createdResult.Value);
            Assert.Equal("Test Goal", goal.Title);
        }

        [Fact]
        public async Task UpdateProgress_To100Percent_SetsStatusToCompleted()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var userId = "test-user-456";

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = "test2@test.com",
                Email = "test2@test.com"
            };
            await userManager.CreateAsync(user);

            var goal = new Goal
            {
                Title = "Test Goal",
                UserId = userId,
                Status = GoalStatus.InProgress,
                ProgressPercentage = 50
            };
            context.Goals.Add(goal);
            await context.SaveChangesAsync();

            var controller = new GoalsController(context, userManager)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = GetClaimsPrincipal(userId)
                    }
                }
            };

            var request = new GoalsController.GoalProgressUpdateRequest
            {
                GoalId = goal.Id,
                Progress = 100
            };

            // Act
            var result = await controller.UpdateProgress(goal.Id, request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedGoal = Assert.IsType<Goal>(okResult.Value);
            Assert.Equal(100, updatedGoal.ProgressPercentage);
            Assert.Equal(GoalStatus.Completed, updatedGoal.Status);
        }

        [Fact]
        public async Task GetById_NonExistentGoal_ReturnsNotFound()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var userId = "test-user-789";

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = "test3@test.com",
                Email = "test3@test.com"
            };
            await userManager.CreateAsync(user);

            var controller = new GoalsController(context, userManager)
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
            var result = await controller.GetById(999);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task Delete_GoalBelongingToAnotherUser_ReturnsNotFound()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var owner = "owner-user-123";
            var otherUser = "other-user-456";

            var ownerUserObj = new ApplicationUser
            {
                Id = owner,
                UserName = "owner@test.com",
                Email = "owner@test.com"
            };
            await userManager.CreateAsync(ownerUserObj);

            var otherUserObj = new ApplicationUser
            {
                Id = otherUser,
                UserName = "other@test.com",
                Email = "other@test.com"
            };
            await userManager.CreateAsync(otherUserObj);

            var goal = new Goal
            {
                Title = "Owner's Goal",
                UserId = owner,
                Status = GoalStatus.NotStarted
            };
            context.Goals.Add(goal);
            await context.SaveChangesAsync();

            var controller = new GoalsController(context, userManager)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = GetClaimsPrincipal(otherUser)
                    }
                }
            };

            // Act
            var result = await controller.Delete(goal.Id);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
            Assert.NotNull(await context.Goals.FindAsync(goal.Id));
        }

        [Fact]
        public async Task Create_InvalidRequest_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var userId = "test-user-321";

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = "test4@test.com",
                Email = "test4@test.com"
            };
            await userManager.CreateAsync(user);

            var controller = new GoalsController(context, userManager)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = GetClaimsPrincipal(userId)
                    }
                }
            };

            controller.ModelState.AddModelError("Title", "Title is required");

            var request = new GoalsController.GoalCreateRequest
            {
                Title = "",
                Priority = GoalPriority.Medium
            };

            // Act
            var result = await controller.Create(request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
