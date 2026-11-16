using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.models;

public class DCandidate
{
    [Key]
    public int id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string fullName { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string email { get; set; } = string.Empty;

    public int age { get; set; }

    [Column(TypeName = "nvarchar(3)")]
    public string bloodGroup { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string mobile { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string address { get; set; } = string.Empty;
}