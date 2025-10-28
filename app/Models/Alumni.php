<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'course_id',
        'student_id',
        'graduation_year',
        'enrollment_year',
        'honors',
        'thesis_title',
        'academic_achievements',
        'extracurricular',
        'continue_education',
        'employment_status_id',
        'femployment_status_id',
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

    // Add this to include the accessors in JSON responses
    protected $appends = ['profile_image_url', 'full_name'];

    // Relationships
    public function documents()
    {
        return $this->hasMany(AlumniDocument::class);
    }

    // Traditional Accessor Methods (for older Laravel versions)

    /**
     * Get the full name attribute
     */
    public function getFullNameAttribute()
    {
        $name = $this->first_name;

        if (!empty($this->middle_name)) {
            $name .= ' ' . $this->middle_name;
        }

        $name .= ' ' . $this->last_name;

        if (!empty($this->suffix)) {
            $name .= ' ' . $this->suffix;
        }

        return trim($name);
    }

    /**
     * Get the profile image URL attribute
     */
    public function getProfileImageUrlAttribute2eeee()
    {
        if (!$this->profile_image) {
            return null;
        }

        // If it's already a full URL, return as is
        if (filter_var($this->profile_image, FILTER_VALIDATE_URL)) {
            return $this->profile_image;
        }

        // Generate full URL for stored images
        // Use Storage::url() if using Laravel's filesystem
        if (config('filesystems.default') === 'public') {
            return asset('storage/' . $this->profile_image);
        }

        return Storage::url($this->profile_image);
    }



    /**
     * Alternative: If you want to keep the original profile_image but also have URL
     */
    public function getProfileImageUrlAttribute()
    {
        if (!$this->profile_image) {
            return null;
        }

        if (filter_var($this->profile_image, FILTER_VALIDATE_URL)) {
            return $this->profile_image;
        }

        // Add storage/ prefix for files in storage/app/public/
        return asset('storage/' . $this->profile_image);
    }

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

    public function employmentStatus()
    {
        return $this->belongsTo(EmploymentStatus::class);
    }

     public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
}
