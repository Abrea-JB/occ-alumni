<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\AlumniDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AlumniRegistrationController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                // Personal Information
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'suffix' => 'nullable|string|max:10',
                'email' => 'required|email|unique:alumni,email',
                'phone' => 'required|string|max:20',
                'address' => 'required|string',
                // 'birth_date' => 'required|date', // Add this back
                'gender' => 'required|in:male,female,other,prefer_not_to_say',
                'bio' => 'nullable|string',
                'profile_image' => 'nullable|image|max:5120', // 5MB

                // Academic Information
                'course' => 'required|string|max:255',
                'student_id' => 'nullable|string|max:50',
                'graduation_year' => 'required|integer|min:1900|max:' . (date('Y') + 5),
                'enrollment_year' => 'nullable|integer|min:1900|max:' . date('Y'),
                'honors' => 'nullable|array',
                'thesis_title' => 'nullable|string|max:500',
                'academic_achievements' => 'nullable|string',
                'extracurricular' => 'nullable|string',
                'continue_education' => 'boolean',

                // Career Information
                'employment_status' => 'required|in:employed,unemployed,self-employed,freelancer,graduate_student,entrepreneur,seeking_opportunities',
                'current_company' => 'nullable|string|max:255',
                'job_title' => 'nullable|string|max:255',
                'industry' => 'nullable|string|max:255',
                'years_experience' => 'nullable|integer|min:0|max:50',
                'salary_range' => 'nullable|string|max:50',
                'work_location' => 'nullable|string|max:255',
                'career_goals' => 'nullable|string',
                'previous_companies' => 'nullable|string',

                // Social Media
                'linkedin' => 'nullable|url|max:255',
                'github' => 'nullable|url|max:255',
                'portfolio' => 'nullable|url|max:255',
                'twitter' => 'nullable|url|max:255',

                // Skills
                'technical_skills' => 'nullable|array',
                'soft_skills' => 'nullable|array',
                'certifications' => 'nullable|array',
                'languages' => 'nullable|array',
                'professional_interests' => 'nullable|string',
                'hobbies' => 'nullable|string',
                'volunteer_interests' => 'nullable|array',
                'willing_to_mentor' => 'boolean',

                // Agreements
                'agreement' => 'required|accepted',
                'newsletter' => 'boolean',
                'contact_permission' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registration failed. Please check the errors below.',
                    'errors' => $validator->errors(),
                    'field_errors' => $validator->errors()->all(),
                    'specific_errors' => $validator->errors()->toArray()
                ], 422);
            }

            // Process and format the birth_date after successful validation
            $validated = $validator->validated();

            // Format birth_date to YYYY-MM-DD
            // try {
            //     $validated['birth_date'] = \Carbon\Carbon::parse($validated['birth_date'])->format('Y-m-d');
            // } catch (\Exception $e) {
            //     return response()->json([
            //         'success' => false,
            //         'message' => 'Invalid date format provided.',
            //         'error' => 'The birth date could not be processed.'
            //     ], 422);
            // }

            $birth_date = date('Y-m-d', strtotime($request->birth_date));

            // Generate application ID
            $applicationId = 'APP-' . date('Ymd') . '-' . Str::random(6);

            // Handle profile image upload
            $profileImagePath = null;
            if ($request->hasFile('profile_image')) {
                $profileImagePath = $request->file('profile_image')->store('alumni/profile-images', 'public');
            }

            // Handle array fields - convert to JSON if they are arrays
            $arrayFields = [
                'honors',
                'technical_skills',
                'soft_skills',
                'certifications',
                'languages',
                'volunteer_interests'
            ];

            foreach ($arrayFields as $field) {
                if (isset($validated[$field]) && is_array($validated[$field])) {
                    $validated[$field] = json_encode($validated[$field]);
                }
            }

            // Create alumni record
            $alumni = Alumni::create([
                'application_id' => $applicationId,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'suffix' => $validated['suffix'] ?? null,
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'birth_date' => $birth_date,
                'gender' => $validated['gender'],
                'bio' => $validated['bio'] ?? null,
                'profile_image' => $profileImagePath,

                // Academic Information
                'course' => $validated['course'],
                'student_id' => $validated['student_id'] ?? null,
                'graduation_year' => $validated['graduation_year'],
                'enrollment_year' => $validated['enrollment_year'] ?? null,
                'honors' => $validated['honors'] ?? null,
                'thesis_title' => $validated['thesis_title'] ?? null,
                'academic_achievements' => $validated['academic_achievements'] ?? null,
                'extracurricular' => $validated['extracurricular'] ?? null,
                'continue_education' => $validated['continue_education'] ?? false,

                // Career Information
                'employment_status' => $validated['employment_status'],
                'current_company' => $validated['current_company'] ?? null,
                'job_title' => $validated['job_title'] ?? null,
                'industry' => $validated['industry'] ?? null,
                'years_experience' => $validated['years_experience'] ?? null,
                'salary_range' => $validated['salary_range'] ?? null,
                'work_location' => $validated['work_location'] ?? null,
                'career_goals' => $validated['career_goals'] ?? null,
                'previous_companies' => $validated['previous_companies'] ?? null,

                // Social Media
                'linkedin' => $validated['linkedin'] ?? null,
                'github' => $validated['github'] ?? null,
                'portfolio' => $validated['portfolio'] ?? null,
                'twitter' => $validated['twitter'] ?? null,

                // Skills
                'technical_skills' => $validated['technical_skills'] ?? null,
                'soft_skills' => $validated['soft_skills'] ?? null,
                'certifications' => $validated['certifications'] ?? null,
                'languages' => $validated['languages'] ?? null,
                'professional_interests' => $validated['professional_interests'] ?? null,
                'hobbies' => $validated['hobbies'] ?? null,
                'volunteer_interests' => $validated['volunteer_interests'] ?? null,
                'willing_to_mentor' => $validated['willing_to_mentor'] ?? false,

                // Agreements
                'agreement' => $validated['agreement'],
                'newsletter' => $validated['newsletter'] ?? false,
                'contact_permission' => $validated['contact_permission'] ?? false,
            ]);

            // Handle document uploads
            if ($request->has('documents')) {
                foreach ($request->documents as $document) {
                    if (isset($document['file'])) {
                        $filePath = $document['file']->store('alumni/documents', 'public');

                        AlumniDocument::create([
                            'alumni_id' => $alumni->id,
                            'document_type' => $document['type'],
                            'file_path' => $filePath,
                            'file_name' => $document['file']->getClientOriginalName(),
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Alumni registration submitted successfully!',
                'application_id' => $applicationId,
                'data' => $alumni->load('documents')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            // Clean up uploaded files if any
            if (isset($profileImagePath)) {
                Storage::disk('public')->delete($profileImagePath);
            }

            // Log the error for debugging
            \Log::error('Alumni registration error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show($id)
    {
        $alumni = Alumni::with('documents')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $alumni
        ]);
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $alumni = Alumni::findOrFail($id);

            $validated = $request->validate([
                // Add validation rules for update (similar to store but with sometimes)
                'first_name' => 'sometimes|required|string|max:255',
                'last_name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|unique:alumni,email,' . $alumni->id,
                'phone' => 'sometimes|required|string|max:20',
                'profile_image' => 'sometimes|image|max:5120',
                // Add other fields as needed
            ]);

            // Handle profile image update
            if ($request->hasFile('profile_image')) {
                // Delete old image
                if ($alumni->profile_image) {
                    Storage::disk('public')->delete($alumni->profile_image);
                }

                $profileImagePath = $request->file('profile_image')->store('alumni/profile-images', 'public');
                $validated['profile_image'] = $profileImagePath;
            }

            $alumni->update($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Alumni information updated successfully!',
                'data' => $alumni->load('documents')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Update failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string',
            'rejection_reason' => 'required_if:status,rejected|string'
        ]);

        $alumni = Alumni::findOrFail($id);

        $alumni->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes
        ]);

        // Update document statuses if rejected
        if ($request->status === 'rejected') {
            $alumni->documents()->update([
                'status' => 'rejected',
                'rejection_reason' => $request->rejection_reason
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Alumni status updated successfully!',
            'data' => $alumni
        ]);
    }

    public function index(Request $request)
    {
        $query = Alumni::with('documents');

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by course
        if ($request->has('course')) {
            $query->where('course', $request->course);
        }

        // Pagination
        $alumni = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $alumni
        ]);
    }
}
