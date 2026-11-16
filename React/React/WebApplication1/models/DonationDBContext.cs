using Microsoft.EntityFrameworkCore;

namespace WebApplication1.models
{
    public class DonationDBContext : DbContext
    {
        public DonationDBContext(DbContextOptions<DonationDBContext> options) : base(options)
        {
        }

        public DbSet<DCandidate> DCandidates { get; set; }
    }
}