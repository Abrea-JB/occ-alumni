<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ThesisGroups;
use App\Models\Faculties;
use App\Models\Users;
use App\Models\Thesis;
use App\Models\Students;
use App\Models\ThesisComments;
use App\Models\GroupDetails;
use App\Models\DefenseShedule;
use App\Models\DefensePanel;
use App\Models\DefensePanelFaculty;
use App\Models\ThesisDoc;
use App\Models\ScheduleDocuments;
use App\Models\ConceptPaperRating;
use App\Models\DefenseThesisDetails;
use App\Models\Groups;
use App\Models\Notifications;
use App\Models\Thesislogs;
use Illuminate\Support\Facades\File;
use DB;
use URL;

class FacultyController extends Controller
{

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = max(intval($request->input('page', 0)), 0) + 1;
        $offset = ($page - 1) * $perPage;

        $baseQuery = DB::table('faculty')
            ->join('users', 'faculty.user_id', '=', 'users.id')
            // ->join('department', 'faculty.department_id', '=', 'department.id')
            // ->join('college', 'department.college_id', '=', 'college.id')
            ->where('users.id', '!=', 0)
            ->select('faculty.*', 'users.email', 'users.image');

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
        $faculties = $baseQuery
            ->offset($offset)
            ->limit($perPage)
            ->get();

        return response()->json([
            'total' => $totalRecords,
            'per_page' => $perPage,
            'page' => $page,
            'faculties' => $faculties,
        ]);
    }

    public function dashboard() {}

    public function store(Request $request)
    {
        DB::beginTransaction();
        $check = Users::whereEmail($request->email)->first();

        if ($check) {
            if ($check->id != $request->user_id) {
                return response()->json(['result' => false, 'message' => $check->id . $request->user_id], 500);
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
                $student_check = Faculties::where('id', $request->id)->first();
                if (!$student_check) {
                    return response()->json(['result' => false, 'message' => "Data did not mactch!"], 500);
                }
                $user_check = Users::where('id', $student_check->user_id)->first();

                Faculties::where('user_id', $request->user_id)
                    ->update([
                        'fname' => $request->fname,
                        'mname' => $mname,
                        'lname' => $request->lname,
                        'phone' => $phone,
                    ]);

                Users::where('id', $request->user_id)
                    ->update([
                        'email' => $request->email,
                        "name" => $fname . ' ' . $lname,
                    ]);

                if ($request->hasFile('image')) {
                    try {
                        $image = $request->file('image');
                        $uploadPath = public_path('uploads/profile');

                        // Ensure upload directory exists
                        if (!File::isDirectory($uploadPath)) {
                            File::makeDirectory($uploadPath, 0755, true);
                        }


                        // Delete old image if it exists
                        if ($user_check->image && File::exists($uploadPath . '/' . $user_check->image)) {
                            File::delete($uploadPath . '/' . $user_check->image);
                        }

                        // Generate unique filename
                        $fileName = 'faculty-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $image->getClientOriginalExtension();

                        // Move new image
                        $image->move($uploadPath, $fileName);

                        // Update user record
                        Users::where('id', $user_check->id)
                            ->update(['image' => $fileName]);
                        DB::commit();
                        return 'updated';
                    } catch (\Exception $e) {
                        // Log error and handle appropriately
                        \Log::error('Image upload failed: ' . $e->getMessage());
                        return back()->with('error', 'Image upload failed');
                    }
                }
            }
            $fileName = '';
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $fileName =  "faculty-" . rand() . time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/profile'), $fileName);
            }
            $user = Users::create([
                "name" => $fname . ' ' . $lname,
                "email" => $request->email,
                "image" => $fileName,
                "role" => 'faculty',
                "password" => bcrypt('password123'), //$request->password
            ]);
            Faculties::create([
                "user_id" => $user->id,
                "fname" => $fname,
                "lname" => $lname,
                "mname" => $mname,
                "phone" => $phone,
            ]);
            DB::commit();
            return 'created';
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function storeComments(Request $request)
    {
        // $user = auth('api')->user();
        // $faculty = Faculties::where('user_id',$user->id)->first();
        $comment_check = ThesisComments::where('document_id', $request->document_id)->first();
        $doc = ThesisDoc::where('id', $request->document_id)->first();
        DB::beginTransaction();

        try {
            if ($comment_check) {
                ThesisComments::where('document_id', $request->document_id)
                    ->update(['comment' => $request->comment]);

                Thesislogs::create([
                    "thesis_id" =>   $doc->thesis_id,
                    "log" =>  "Faculty Updated Comments",
                ]);
                DB::commit();
                return response()->json(['result' => true, 'message' => "updated!"], 200);
            }
            $comment = new ThesisComments();
            $comment->comment = $request->comment;
            $comment->document_id = $request->document_id;
            // $comment->thesis_id = $request->thesis_id;
            // $comment->faculty_id = $faculty->id;
            $comment->save();

            Thesislogs::create([
                "thesis_id" =>   $doc->thesis_id,
                "log" =>  "Faculty Added Comments",
            ]);
            DB::commit();
            return response()->json(['result' => true, 'message' => "Saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }


    public function notifications(Request $request)
    {
        return 2;
        $user = auth('api')->user();
        $recipient = Faculties::where('user_id', $user->id)->first();
        $notifications = Notifications::where('user_id', $recipient->id)->first();
        $return = array(
            'notifications'         => $notifications,
        );
        return response()->json($return, 200);
    }
}
