<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\Users;
use App\Models\Thesis;
use App\Models\ThesisDoc;
use App\Models\ScheduleDocuments;
use App\Models\Notifications;
use Illuminate\Support\Facades\File;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StudentsImport;
use App\Models\College;
use App\Models\Department;
use App\Models\Thesislogs;
use DB;


class StudentsController extends Controller
{

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = max(intval($request->input('page', 0)), 0) + 1;
        $offset = ($page - 1) * $perPage;

        $baseQuery = DB::table('students')
            ->join('users', 'students.user_id', '=', 'users.id')
            ->join('department', 'students.department_id', '=', 'department.id')
            ->join('college', 'department.college_id', '=', 'college.id')
            ->where('users.id', '!=', 0)
            ->select('students.*', 'users.email', 'users.image', 'department.dept_name');

        // Apply dynamic filters
        $filters = $request->input('filter', []);

        if (!empty($filters['keywords'])) {
            $keyword = $filters['keywords'];
            $baseQuery->where(function ($q) use ($keyword) {
                $q->whereRaw("CONCAT_WS('', fname, lname, mname, users.email) LIKE ?", ["%{$keyword}%"]);
            });
        }

        if (!empty($filters['college_id'])) {
            $baseQuery->where('college.id', $filters['college_id']);
        }

        if (!empty($filters['department_id'])) {
            $baseQuery->where('department.id', $filters['department_id']);
        }

        // Clone query for total count
        $totalRecords = (clone $baseQuery)->count();

        // Get paginated results
        $students = $baseQuery
            ->offset($offset)
            ->limit($perPage)
            ->get();

        return response()->json([
            'total' => $totalRecords,
            'per_page' => $perPage,
            'page' => $page,
            'students' => $students,
        ]);
    }


    public function store(Request $request)
    {
        DB::beginTransaction();
        $check = Users::whereEmail($request->email)->first();

        if ($check) {
            if ($check->id != $request->user_id) {
                return response()->json(['result' => false, 'message' => "Email is not available!"], 500);
            }
        }
        $fname = strtoupper($request->fname);
        $lname = strtoupper($request->lname);
        $mname = '';
        if (isset($request->mname)) {
            if ($request->mname != 'undefined')
                $mname = strtoupper($request->mname);
        }

        $phone = '';
        if (isset($request->phone)) {
            if ($request->phone != 'undefined')
                $phone = strtoupper($request->phone);
        }
        try {

            if (isset($request->id)) {
                $student = Students::find($request->id);

                if (!$student) {
                    return response()->json(['result' => false, 'message' => "Data did not match!"], 500);
                }

                $user = Users::find($student->user_id);

                if (!$user) {
                    return response()->json(['result' => false, 'message' => "User not found!"], 500);
                }

                // Update student
                $student->update([
                    'fname' => $request->fname,
                    'mname' => $mname ?? null,
                    'lname' => $request->lname,
                    'phone' => $phone ?? null,
                    'email' => $request->email,
                    'student_id' => $request->student_id,
                    'college_id' => $request->college_id,
                    'department_id' => $request->department_id,
                ]);

                // Update user
                $user->update([
                    'email' => $request->email,
                    'name' => trim(($fname ?? '') . ' ' . ($lname ?? '')),
                ]);

                // Handle profile image upload
                if ($request->hasFile('attendance_profile')) {
                    $image = $request->file('attendance_profile');
                    $fileName = $user->attendance_profile ?:  'attendance' . $student->id . '.jpg';

                    $image->move(public_path('uploads/attendance-profile'), $fileName);

                    $student->attendance_profile = $fileName;
                    $student->save();
                }

                // if ($request->hasFile('image')) {
                //     $image = $request->file('image');
                //     $fileName = $user->image ?: $student->id . '.jpg';

                //     $image->move(public_path('uploads/profile'), $fileName);

                //     $student->image = $fileName;
                //     $user->save();
                // }

                if ($request->hasFile('image')) {
                    try {
                        $image = $request->file('image');
                        $uploadPath = public_path('uploads/profile');
                        if (!File::isDirectory($uploadPath)) {
                            File::makeDirectory($uploadPath, 0755, true);
                        }
                        if ($user->image && File::exists($uploadPath . '/' . $user->image)) {
                            File::delete($uploadPath . '/' . $user->image);
                        }
                        $fileName = $student->id . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $image->getClientOriginalExtension();
                        $image->move($uploadPath, $fileName);
                        $user->update(['image' => $fileName]);
                    } catch (\Exception $e) {
                        \Log::error('Image upload failed: ' . $e->getMessage());
                        return false;
                    }
                }
                DB::commit();

                return response()->json(['success' => true, 'message' => "Updated successfully"], 200);
            }



            $fileName = '';

            // First create the user
            $user = Users::create([
                "name" => $fname . ' ' . $lname,
                "email" => $request->email,
                "role" => 'student',
                "image" => $fileName, // Will be empty initially
                "password" => bcrypt('password123'), // Consider making this configurable
            ]);

            // Then create the student
            $student = Students::create([
                "user_id" => $user->id,
                "fname" => $fname,
                "lname" => $lname,
                "mname" => $mname,
                "phone" => $phone,
                "email" => $request->email,
                "college_id" => $request->college_id,
                "department_id" => $request->department_id,
                'student_id' => $request->student_id,
            ]);

            if ($request->hasFile('attendance_profile')) {
                $image = $request->file('attendance_profile');
                $fileName = $user->attendance_profile ?:  'attendance' . $student->id . '.jpg';

                $image->move(public_path('uploads/attendance-profile'), $fileName);

                $student->attendance_profile = $fileName;
                $student->save();
            }

            if ($request->hasFile('image')) {
                try {
                    $image = $request->file('image');
                    $uploadPath = public_path('uploads/profile');
                    if (!File::isDirectory($uploadPath)) {
                        File::makeDirectory($uploadPath, 0755, true);
                    }
                    if ($user->image && File::exists($uploadPath . '/' . $user->image)) {
                        File::delete($uploadPath . '/' . $user->image);
                    }
                    $fileName = $student->id . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $image->getClientOriginalExtension();
                    $image->move($uploadPath, $fileName);
                    $user->update(['image' => $fileName]);
                } catch (\Exception $e) {
                    \Log::error('Image upload failed: ' . $e->getMessage());
                    return false;
                }
            }
            DB::commit();
            return response()->json(['success' => true, 'message' => "saved"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function import(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls,csv|max:5120'
            ]);

            $rawData = Excel::toArray(new StudentsImport, $request->file('file'))[0];

            // Remove header row if exists
            $headers = $rawData[0] ?? [];
            if (isset($headers[0])) {
                array_shift($rawData);
            }

            $results = [
                'rows' => [],
                'summary' => [
                    'total' => 0,
                    'valid' => 0,
                    'errors' => 0,
                    'would_create' => 0,
                    'would_update' => 0,
                ]
            ];

            foreach ($rawData as $index => $row) {
                $rowNumber = $index + 2;
                $studentId = $row[0] ?? 'N/A';
                $department = Department::where('college_id', $row[6])->first();

                $rowResult = [
                    'row_number' => $rowNumber - 1,
                    'student_id' => $studentId,
                    'fname' => $row[1] ?? null,
                    'lname' => $row[2] ?? null,
                    'mname' => $row[3] ?? null,
                    'email' => $row[4] ?? null,
                    'phone' => $row[5] ?? null,
                    'college_id' => $row[6] ?? null,
                    'department_id' => $department->id ?? null,
                    'status' => 'error', 
                    'message' => null
                ];

                try {
                    // Validate required fields
                    if (empty($row[0]) || empty($row[1]) || empty($row[2]) || empty($row[4]) || empty($row[6])) {
                        throw new \Exception("Missing required fields");
                    }

                    // Check if college exists
                    $college = College::find($row[6]);
                    if (!$college) {
                        throw new \Exception("College ID {$row[6]} not found");
                    }
                    $rowResult['college_name'] = $college->college_name;
                    // Check if student exists
                    $existingStudent = Students::where('student_id', $row[0])
                        ->orWhere('email', $row[4])
                        ->first();

                    if ($existingStudent) {
                        $rowResult['status'] = 'would_update';
                        $results['summary']['would_update']++;
                    } else {
                        $rowResult['status'] = 'would_create';
                        $results['summary']['would_create']++;
                    }

                    $results['summary']['valid']++;
                    $rowResult['message'] = 'Valid record';
                } catch (\Exception $e) {
                    $results['summary']['errors']++;
                    $rowResult['message'] = $e->getMessage();
                }

                $results['rows'][] = $rowResult;
            }

            $results['summary']['total'] = count($rawData);

            return response()->json([
                'success' => true,
                'data' => $results,
                'message' => 'Preview generated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'File processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function saveImport(Request $request)
    {
        DB::beginTransaction();
        try {
            $students = $request->students;
            $results = ['created' => 0, 'updated' => 0, 'errors' => []];

            foreach ($students as $studentData) {
                try {
                    $student_id = $studentData['student_id'];
                    $email = $studentData['email'];

                    // Check if student exists (by student_id OR email)
                    $existingStudent = Students::where('student_id', $student_id)
                        ->orWhere('email', $email)
                        ->first();

                    $existingUser = Users::where('email', $email)
                        ->first();

                    if ($existingStudent || $existingUser) {
                        // **Update existing student**
                        $user = Users::find($existingStudent->user_id);
                        if ($user) {
                            $user->update([
                                'name' => $studentData['fname'] . ' ' . $studentData['lname'],
                                'email' => $email,
                            ]);
                        }

                        $existingStudent->update([
                            'fname' => $studentData['fname'],
                            'lname' => $studentData['lname'],
                            'mname' => $studentData['mname'],
                            'phone' => $studentData['phone'],
                            'email' => $email,
                            'college_id' => $studentData['college_id'],
                            'department_id' => $studentData['department_id'],
                        ]);

                        $results['updated']++;
                    } else {
                        // **Create new student**
                        $user = Users::create([
                            'name' => $studentData['fname'] . ' ' . $studentData['lname'],
                            'email' => $email,
                            'role' => 'student',
                            'password' => bcrypt('password123'),
                        ]);

                        Students::create([
                            'user_id' => $user->id,
                            'student_id' => $student_id,
                            'fname' => $studentData['fname'],
                            'lname' => $studentData['lname'],
                            'mname' => $studentData['mname'],
                            'phone' => $studentData['phone'],
                            'email' => $email,
                            'college_id' => $studentData['college_id'],
                            'department_id' => $studentData['department_id'],
                        ]);

                        $results['created']++;
                    }
                } catch (\Exception $e) {
                    $results['errors'][] = "Student $student_id: " . $e->getMessage();
                }
            }

            DB::commit(); 

            return response()->json([
                'success' => true,
                'message' => 'Students processed successfully',
                'results' => $results,
            ]);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback if any major error occurs
            return response()->json([
                'success' => false,
                'message' => 'Transaction failed!',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(), // Debugging
            ], 500);
        }
    }
}
