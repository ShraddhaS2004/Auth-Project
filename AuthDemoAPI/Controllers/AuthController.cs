
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using AuthDemoAPI.Models;

namespace AuthDemoAPI.Controllers
{
	[ApiController]
	[Route("api/auth")]
	public class AuthController : ControllerBase
	{
		private readonly IConfiguration _config;

		public AuthController(IConfiguration config)
		{
			_config = config;
		}

		private SqlConnection GetConnection()
		{
			return new SqlConnection(_config.GetConnectionString("DefaultConnection"));
		}

        // SIGNUP
        [HttpPost("signup")]
        public IActionResult Signup(User user)
        {
            using var con = GetConnection();
            con.Open();

            //  Hash the password before saving
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

            string query = "INSERT INTO Users (Username, Email, Password) VALUES (@u, @e, @p)";
            using var cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@u", user.Username);
            cmd.Parameters.AddWithValue("@e", user.Email);
            cmd.Parameters.AddWithValue("@p", hashedPassword);  

            cmd.ExecuteNonQuery();
            return Ok(new { message = "User registered successfully" });
        }


        // LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            using var con = GetConnection();
            con.Open();

            // Get user by email only
            string query = "SELECT Password FROM Users WHERE Email = @e";
            using var cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@e", request.Email);

            var result = cmd.ExecuteScalar();

            if (result == null)
                return Unauthorized(new { message = "Invalid credentials" });

            string storedHash = result.ToString();

            // Verify password
            bool isValid = BCrypt.Net.BCrypt.Verify(request.Password, storedHash);

            if (!isValid)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new { message = "Login successful" });
        }

    }
}
