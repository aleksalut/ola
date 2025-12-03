using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using ola.Controllers;
using ola.Data;
using ola.Models;
using ola.Services;
using System.Security.Claims;
using Xunit;

namespace ola.Tests.Controllers
{
    public class EmotionEntriesControllerTests
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

        private Mock<IAuditService> GetMockAuditService()
        {
            var mock = new Mock<IAuditService>();
            mock.Setup(x => x.LogAction(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<object>()))
                .Returns(Task.CompletedTask);
            return mock;
        }

        [Fact]
        public async Task Create_ValidEmotionEntry_ReturnsCreatedAtAction()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var auditService = GetMockAuditService();
            var userId = "test-user-123";

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = "test@test.com",
                Email = "test@test.com"
            };
            await userManager.CreateAsync(user);

            var controller = new EmotionEntriesController(context, userManager, auditService.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = GetClaimsPrincipal(userId)
                    }
                }
            };

            var request = new EmotionEntriesController.EmotionCreateRequest
            {
                Text = "Feeling great today!",
                Anxiety = 1,
                Calmness = 5,
                Joy = 5,
                Anger = 1,
                Boredom = 1
            };

            // Act
            var result = await controller.Create(request);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(EmotionEntriesController.GetById), createdResult.ActionName);
            var entry = Assert.IsType<EmotionEntry>(createdResult.Value);
            Assert.Equal("Feeling great today!", entry.Text);
            Assert.Equal(5, entry.Joy);
            Assert.Equal(1, entry.Anxiety);
        }

        [Fact]
        public async Task Update_ValidEntry_ModifiesFieldsCorrectly()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var auditService = GetMockAuditService();
            var userId = "test-user-456";

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = "test2@test.com",
                Email = "test2@test.com"
            };
            await userManager.CreateAsync(user);

            var entry = new EmotionEntry
            {
                Text = "Original text",
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Anxiety = 3,
                Calmness = 3,
                Joy = 3,
                Anger = 2,
                Boredom = 2
            };
            context.EmotionEntries.Add(entry);
            await context.SaveChangesAsync();

            var controller = new EmotionEntriesController(context, userManager, auditService.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = GetClaimsPrincipal(userId)
                    }
                }
            };

            var updateRequest = new EmotionEntriesController.EmotionCreateRequest
            {
                Text = "Updated text with new feelings",
                Anxiety = 2,
                Calmness = 4,
                Joy = 5,
                Anger = 1,
                Boredom = 1
            };

            // Act
            var result = await controller.Update(entry.Id, updateRequest);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedEntry = Assert.IsType<EmotionEntry>(okResult.Value);
            Assert.Equal("Updated text with new feelings", updatedEntry.Text);
            Assert.Equal(2, updatedEntry.Anxiety);
            Assert.Equal(4, updatedEntry.Calmness);
            Assert.Equal(5, updatedEntry.Joy);
            Assert.Equal(1, updatedEntry.Anger);
        }

        [Fact]
        public async Task Delete_ExistingEntry_RemovesFromDatabase()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var auditService = GetMockAuditService();
            var userId = "test-user-789";

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = "test3@test.com",
                Email = "test3@test.com"
            };
            await userManager.CreateAsync(user);

            var entry = new EmotionEntry
            {
                Text = "Entry to delete",
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Anxiety = 3,
                Joy = 3
            };
            context.EmotionEntries.Add(entry);
            await context.SaveChangesAsync();

            var controller = new EmotionEntriesController(context, userManager, auditService.Object)
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
            var result = await controller.Delete(entry.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var deletedEntry = await context.EmotionEntries.FindAsync(entry.Id);
            Assert.Null(deletedEntry);
        }

        [Fact]
        public async Task GetById_WrongId_ReturnsNotFound()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var auditService = GetMockAuditService();
            var userId = "test-user-321";

            var user = new ApplicationUser
            {
                Id = userId,
                UserName = "test4@test.com",
                Email = "test4@test.com"
            };
            await userManager.CreateAsync(user);

            var controller = new EmotionEntriesController(context, userManager, auditService.Object)
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
        public async Task Delete_EntryOfAnotherUser_ReturnsNotFound()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var auditService = GetMockAuditService();
            var ownerId = "owner-123";
            var otherUserId = "other-456";

            var owner = new ApplicationUser
            {
                Id = ownerId,
                UserName = "owner@test.com",
                Email = "owner@test.com"
            };
            await userManager.CreateAsync(owner);

            var otherUser = new ApplicationUser
            {
                Id = otherUserId,
                UserName = "other@test.com",
                Email = "other@test.com"
            };
            await userManager.CreateAsync(otherUser);

            var entry = new EmotionEntry
            {
                Text = "Owner's private entry",
                UserId = ownerId,
                CreatedAt = DateTime.UtcNow,
                Anxiety = 3,
                Joy = 3
            };
            context.EmotionEntries.Add(entry);
            await context.SaveChangesAsync();

            var controller = new EmotionEntriesController(context, userManager, auditService.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext
                    {
                        User = GetClaimsPrincipal(otherUserId)
                    }
                }
            };

            // Act
            var result = await controller.Delete(entry.Id);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
            Assert.NotNull(await context.EmotionEntries.FindAsync(entry.Id));
        }
    }
}
