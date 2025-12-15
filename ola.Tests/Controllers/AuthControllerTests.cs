using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using ola.Auth;
using ola.Controllers;
using ola.Data;
using ola.Models;
using ola.Services;
using Xunit;

namespace ola.Tests.Controllers
{
    public class AuthControllerTests
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

        private Mock<SignInManager<ApplicationUser>> GetMockSignInManager(UserManager<ApplicationUser> userManager)
        {
            var contextAccessor = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
            var claimsFactory = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
            var signInManager = new Mock<SignInManager<ApplicationUser>>(
                userManager,
                contextAccessor.Object,
                claimsFactory.Object,
                null!,
                null!,
                null!,
                null!
            );
            return signInManager;
        }

        private Mock<ITokenService> GetMockTokenService()
        {
            var mock = new Mock<ITokenService>();
            mock.Setup(x => x.CreateToken(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>()))
                .Returns("fake-jwt-token-12345");
            return mock;
        }

        [Fact]
        public async Task Register_ValidRequest_CreatesUserAndAssignsRole()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var signInManager = GetMockSignInManager(userManager);
            var tokenService = GetMockTokenService();

            var controller = new AuthController(userManager, signInManager.Object, tokenService.Object);

            var request = new RegisterRequest
            {
                Email = "newuser@test.com",
                Password = "Password123!",
                FirstName = "New",
                LastName = "User"
            };

            // Add User role to context
            context.Roles.Add(new IdentityRole { Name = "User", NormalizedName = "USER" });
            await context.SaveChangesAsync();

            // Act
            var result = await controller.Register(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);

            var user = await userManager.FindByEmailAsync(request.Email);
            Assert.NotNull(user);
            Assert.Equal("New", user.FirstName);
            Assert.Equal("User", user.LastName);
            Assert.Equal("newuser@test.com", user.Email);

            // Verify role assignment
            var roles = await userManager.GetRolesAsync(user);
            Assert.Contains("User", roles);
        }

        [Fact]
        public async Task Register_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var signInManager = GetMockSignInManager(userManager);
            var tokenService = GetMockTokenService();

            var controller = new AuthController(userManager, signInManager.Object, tokenService.Object);

            var request = new RegisterRequest
            {
                Email = "",  // Invalid email
                Password = "short",  // Too short password
                FirstName = "Test",
                LastName = "User"
            };

            // Act
            var result = await controller.Register(request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Login_CorrectCredentials_ReturnsJwtToken()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var signInManager = GetMockSignInManager(userManager);
            var tokenService = GetMockTokenService();

            // Create a test user
            var user = new ApplicationUser
            {
                Id = "test-user-123",
                UserName = "testuser@test.com",
                Email = "testuser@test.com",
                FirstName = "Test",
                LastName = "User"
            };
            await userManager.CreateAsync(user, "Password123!");

            // Setup SignInManager mock to return success
            signInManager
                .Setup(x => x.CheckPasswordSignInAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>(), false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

            var controller = new AuthController(userManager, signInManager.Object, tokenService.Object);

            var request = new LoginRequest
            {
                Email = "testuser@test.com",
                Password = "Password123!"
            };

            // Act
            var result = await controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var authResponse = Assert.IsType<AuthResponse>(okResult.Value);
            Assert.Equal("fake-jwt-token-12345", authResponse.Token);
            tokenService.Verify(x => x.CreateToken(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>()), Times.Once);
        }

        [Fact]
        public async Task Login_WrongCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var signInManager = GetMockSignInManager(userManager);
            var tokenService = GetMockTokenService();

            // Create a test user
            var user = new ApplicationUser
            {
                Id = "test-user-456",
                UserName = "testuser2@test.com",
                Email = "testuser2@test.com"
            };
            await userManager.CreateAsync(user, "CorrectPassword123!");

            // Setup SignInManager mock to return failure
            signInManager
                .Setup(x => x.CheckPasswordSignInAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>(), false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            var controller = new AuthController(userManager, signInManager.Object, tokenService.Object);

            var request = new LoginRequest
            {
                Email = "testuser2@test.com",
                Password = "WrongPassword!"
            };

            // Act
            var result = await controller.Login(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.NotNull(unauthorizedResult.Value);
            tokenService.Verify(x => x.CreateToken(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>()), Times.Never);
        }

        [Fact]
        public async Task Login_NonExistentUser_ReturnsUnauthorized()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var userManager = GetMockUserManager(context);
            var signInManager = GetMockSignInManager(userManager);
            var tokenService = GetMockTokenService();

            var controller = new AuthController(userManager, signInManager.Object, tokenService.Object);

            var request = new LoginRequest
            {
                Email = "nonexistent@test.com",
                Password = "Password123!"
            };

            // Act
            var result = await controller.Login(request);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.NotNull(unauthorizedResult.Value);
            tokenService.Verify(x => x.CreateToken(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>()), Times.Never);
        }
    }
}
