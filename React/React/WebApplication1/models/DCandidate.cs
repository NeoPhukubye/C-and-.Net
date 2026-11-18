using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.models;

public class DCandidate
{
    [Key]
    public int id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 2)]
    [Column(TypeName = "nvarchar(100)")]
    public string fullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    [Column(TypeName = "nvarchar(100)")]
    public string email { get; set; } = string.Empty;

    [Range(1, 120)]
    public int age { get; set; }

    [Required]
    [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Blood group must be one of A+, A-, B+, B-, AB+, AB-, O+ or O-.")]
    [Column(TypeName = "nvarchar(3)")]
    public string bloodGroup { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(100)]
    [Column(TypeName = "nvarchar(100)")]
    public string mobile { get; set; } = string.Empty;

    [StringLength(100)]
    [Column(TypeName = "nvarchar(100)")]
    public string address { get; set; } = string.Empty;
}
