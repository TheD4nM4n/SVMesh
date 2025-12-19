using Microsoft.AspNetCore.Mvc;

namespace SVMesh.Server.Controllers;

[ApiController]
[Route("api/content")]
public class ContentController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public ContentController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpGet("updates")]
    public IActionResult GetUpdateFiles()
    {
        try
        {
            var updatesPath = Path.Combine(_environment.WebRootPath, "content", "updates");
            
            if (!Directory.Exists(updatesPath))
            {
                return Ok(new { files = new string[0] });
            }

            var files = Directory.GetFiles(updatesPath, "*.md")
                .Select(file => Path.GetFileName(file))
                .OrderByDescending(file => file) // Simple ordering, could be improved with file dates
                .ToArray();

            return Ok(new { files });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to list update files", details = ex.Message });
        }
    }

    [HttpGet("pages")]
    public IActionResult GetPageFiles()
    {
        try
        {
            var pagesPath = Path.Combine(_environment.WebRootPath, "content", "pages");
            
            if (!Directory.Exists(pagesPath))
            {
                return Ok(new { files = new string[0] });
            }

            var files = Directory.GetFiles(pagesPath, "*.md")
                .Select(file => Path.GetFileName(file))
                .OrderBy(file => file)
                .ToArray();

            return Ok(new { files });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to list page files", details = ex.Message });
        }
    }
}