// Import the collection types used by the action results.
using System.Collections.Generic;
// Import LINQ so the ordering and filtering queries can be written fluently.
using System.Linq;
// Import Task so the actions can be asynchronous.
using System.Threading.Tasks;
// Import the base ControllerBase class and action result types.
using Microsoft.AspNetCore.Mvc;
// Import EF Core async extensions such as ToListAsync.
using Microsoft.EntityFrameworkCore;
// Import the candidate model and database context.
using WebApplication1.models;

namespace WebApplication1.Controllers
{
    // Expose the controller at /api/DCandidate.
    [Route("api/[controller]")]
    // Enable automatic model validation and problem details responses.
    [ApiController]
    public class DCandidateController : ControllerBase
    {
        // Hold the database context injected by the framework.
        private readonly DonationDBContext _context;

        // Receive the scoped database context.
        public DCandidateController(DonationDBContext context)
        {
            _context = context;
        }

        // GET: api/DCandidate
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DCandidate>>> GetDCandidates()
        {
            // Read the table without change tracking because it is only being displayed.
            return await _context.DCandidates
                .AsNoTracking()
                // Sort alphabetically so the client receives a stable order.
                .OrderBy(c => c.fullName)
                .ToListAsync();
        }

        // GET: api/DCandidate/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<DCandidate>> GetDCandidate(int id)
        {
            // Look up one record by its primary key.
            var dCandidate = await _context.DCandidates
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.id == id);

            // Return 404 when the record does not exist.
            if (dCandidate == null)
            {
                return NotFound();
            }

            // Return 200 with the record.
            return dCandidate;
        }

        // PUT: api/DCandidate/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutDCandidate(int id, DCandidate dCandidate)
        {
            // Reject updates for records that do not exist before touching the entity.
            if (!await DCandidateExists(id))
            {
                return NotFound();
            }

            // Trust the route id rather than the body id.
            dCandidate.id = id;

            // Mark every property as modified so EF Core writes the full row.
            _context.Entry(dCandidate).State = EntityState.Modified;

            try
            {
                // Persist the changes to SQL Server.
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Another request may have deleted the row in the meantime.
                if (!await DCandidateExists(id))
                {
                    return NotFound();
                }

                // Any other concurrency failure is a genuine server error.
                throw;
            }

            // 204 tells the client the update succeeded with no body.
            return NoContent();
        }

        // POST: api/DCandidate
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DCandidate>> PostDCandidate(DCandidate dCandidate)
        {
            // Queue the new entity for insertion.
            _context.DCandidates.Add(dCandidate);
            // Write the row and let the database assign the identity value.
            await _context.SaveChangesAsync();

            // Return 201 with a Location header pointing at the new record.
            return CreatedAtAction(nameof(GetDCandidate), new { id = dCandidate.id }, dCandidate);
        }

        // DELETE: api/DCandidate/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteDCandidate(int id)
        {
            // Find the record so it can be removed.
            var dCandidate = await _context.DCandidates.FindAsync(id);
            // Return 404 when there is nothing to delete.
            if (dCandidate == null)
            {
                return NotFound();
            }

            // Queue the entity for deletion.
            _context.DCandidates.Remove(dCandidate);
            // Commit the delete.
            await _context.SaveChangesAsync();

            // 204 confirms the deletion succeeded.
            return NoContent();
        }

        // Helper that checks whether a candidate id exists.
        private Task<bool> DCandidateExists(int id)
        {
            // AnyAsync stops at the first matching row.
            return _context.DCandidates.AnyAsync(e => e.id == id);
        }
    }
}
