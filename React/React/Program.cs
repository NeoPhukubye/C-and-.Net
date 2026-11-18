// Import the ASP.NET Core builder, dependency injection and hosting types.
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
// Import the Kendo UI namespace that provides the MVC helpers.
using Kendo.Mvc;

// Create the builder that configures the MVC application.
var builder = WebApplication.CreateBuilder(args);

// Register controllers together with Razor view support.
builder.Services.AddControllersWithViews();

// Configure MVC JSON so property names are not camel-cased.
builder.Services.AddMvc().AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);
// Register Kendo UI services and defer script rendering to the layout.
builder.Services.AddKendo(x =>
{
    x.DeferToScriptFiles = true;
});

// Build the configured application.
var app = builder.Build();

// Production-only pipeline settings.
if (!app.Environment.IsDevelopment())
{
    // Send unhandled errors to the shared error page.
    app.UseExceptionHandler("/Home/Error");
    // Ask browsers to always use HTTPS.
    app.UseHsts();
}

// Redirect plain HTTP requests to HTTPS.
app.UseHttpsRedirection();
// Serve static files from wwwroot.
app.UseStaticFiles();

// Enable endpoint routing.
app.UseRouting();

// Enable authorization middleware.
app.UseAuthorization();

// Emit the deferred Kendo script block at the end of the response.
app.UseMiddleware<KendoDeferredScriptsMiddleware>();

// Map the default {controller=Home}/{action=Index}/{id?} route.
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Start the web server.
app.Run();
