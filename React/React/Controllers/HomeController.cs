// Import the MVC controller base class and action results.
using Microsoft.AspNetCore.Mvc;

namespace React.Controllers
{
    // Handles the default route and the shared error page for the MVC host.
    public class HomeController : Controller
    {
        // Landing page for the legacy MVC project.
        public IActionResult Index()
        {
            // Explain where the real single-page client lives.
            return Content(
                "Donation Candidate MVC host is running. The React client lives in React/React/react-app (npm run dev).");
        }

        // Error page used by the exception handler in Program.cs.
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            // Render the shared error view without leaking exception details.
            return View();
        }
    }
}
