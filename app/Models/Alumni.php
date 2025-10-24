<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Alumni extends Model
{
    use HasFactory;

    protected $table = 'alumni';

    protected $fillable = [
        'application_id',
        'first_name',
        'last_name',
        'middle_name',
        'suffix',
        'email',
        'phone',
        'address',
        'birth_date',
        'gender',
        'bio',
        'profile_image',
        'course',
        'student_id',
        'graduation_year',
        'enrollment_year',
        'honors',
        'thesis_title',
        'academic_achievements',
        'extracurricular',
        'continue_education',
        'employment_status',
        'current_company',
        'job_title',
        'industry',
        'years_experience',
        'salary_range',
        'work_location',
        'career_goals',
        'previous_companies',
        'linkedin',
        'github',
        'portfolio',
        'twitter',
        'technical_skills',
        'soft_skills',
        'certifications',
        'languages',
        'professional_interests',
        'hobbies',
        'volunteer_interests',
        'willing_to_mentor',
        'agreement',
        'newsletter',
        'contact_permission',
        'status',
        'admin_notes'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'honors' => 'array',
        'technical_skills' => 'array',
        'soft_skills' => 'array',
        'certifications' => 'array',
        'languages' => 'array',
        'volunteer_interests' => 'array',
        'continue_education' => 'boolean',
        'willing_to_mentor' => 'boolean',
        'agreement' => 'boolean',
        'newsletter' => 'boolean',
        'contact_permission' => 'boolean',
    ];

    // Relationships
    public function documents()
    {
        return $this->hasMany(AlumniDocument::class);
    }

    // Accessors
    // protected function fullName(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn () => trim("{$this->first_name} {$this->middle_name} {$this->last_name} {$this->suffix}"),
    //     );
    // }

    // protected function profileImageUrl(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn () => $this->profile_image ? asset('storage/' . $this->profile_image) : null,
    //     );
    // }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('course', 'like', "%{$search}%");
        });
    }

}