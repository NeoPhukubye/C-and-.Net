// Import the Entity Framework Core types this context needs.
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.models
{
    // Database context that exposes the candidate table to the API.
    public class DonationDBContext : DbContext
    {
        // The options (connection string, provider) are supplied by dependency injection.
        public DonationDBContext(DbContextOptions<DonationDBContext> options) : base(options)
        {
        }

        // Represents the DCandidates table in the DonationDB database.
        public DbSet<DCandidate> DCandidates { get; set; }
    }
}
