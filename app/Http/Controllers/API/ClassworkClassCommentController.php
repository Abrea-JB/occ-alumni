<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\ClassworkClassComment;
use App\Models\Classwork;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Helpers\FirebaseHelper;
use App\Models\Classroom;
use App\Models\DeviceToken;
use App\Models\Notification;
use App\Models\Faculties;
use App\Models\Students;

class ClassworkClassCommentController extends Controller
{
    /**
     * Display a listing of comments for a specific classwork.
     */
    public function index($classworkId)
    {
        $classwork = Classwork::where('slug', $classworkId)->firstOrFail();
        $comments = ClassworkClassComment::with(['user'])
            ->where('classwork_id', $classwork->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($comments);
    }

    /**
     * Store a newly created comment in storage.
     */
    public function store(Request $request, $classworkId)
    {
        $classwork = Classwork::with([])->where('slug', $classworkId)->firstOrFail();


        $request->validate([
            'content' => 'required|string|max:2000',
        ]);
        $user = Auth::user();
        $commentData = [
            'classwork_id' => $classwork->id,
            'content' => $request->content,
            'user_id' => $user->id,
        ];
        $comment = ClassworkClassComment::create($commentData);
        $comment->load(['user']);
        $content = $request->content;
        if (strlen($content) > 30) {
            $content = substr($content, 0, 30) . '...';
        }
        $classroom = Classroom::where('id', '=', $classwork->class_id)->first();
        $students = FirebaseHelper::getClassRoomStudents($classwork->class_id);
        $appUrl = env('APP_URL');
        $image =  isset($classroom->hero_image) ?   $appUrl . "uploads/classroom/hero_image/" .  $classroom->hero_image  : null;
        foreach ($students as $student) {
            $student_details = Students::where('id', $student->student_id)->first();
            Notification::create([
                'user_id' => $student_details->user_id,
                'notifiable_type' => 'classwork-comment',
                'data' => json_encode([
                    'title' => 'Class Comments - ' . $classwork->title,
                    'message' => 'New classwork class comment.',
                    'message_id' => $comment->id,
                    'class_id' => $classwork->class_id,
                    'classwork_slug' => $classwork->slug,
                    'class_slug' => $classwork->classroom->slug,
                ]),
                'read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $tokens = DeviceToken::where('user_id', $student->user_id)->where('user_id', '!=', $user->id)
                ->get();
            foreach ($tokens as $token) {
                try {
                    FirebaseHelper::sendClassworkNotification($token['token'], [
                        'user_id' => $user->id,
                        'title' => "New Class Comment",
                        'message' => 'Message: ' .  $content,
                        'className' =>  'Class: ' . $classroom->class_name,
                        'class_id' =>  $classroom['id'],
                        'class_slug' => $classroom['slug'],
                        'classwork_slug' => $classwork['slug'],
                        'classwork_id' => $classwork->id ?? null,
                        'id' => $comment->id,
                        'other_id' =>  $classworkId,
                        'notifiable_type' => "class-comment",
                        'image' =>    $image,
                    ]);
                } catch (\Kreait\Firebase\Exception\Messaging\NotFound $e) {
                    // Remove or mark token as invalid
                    DeviceToken::where('token', $token['token'])->delete();
                }
            }
        }
        $faculty = Faculties::where('id',    $classroom->faculty_id)->firstOrFail();
        $from_id = $faculty->user_id;

        if ($comment->user->role !== 'faculty') {

            Notification::create([
                'user_id' => $from_id,
                'notifiable_type' => 'classwork-comment',
                'data' => json_encode([
                    'title' => 'Class Comments - ' . $classwork->title,
                    'message' => 'New classwork class comment.',
                    'message_id' => $comment->id,
                    'class_id' => $classwork->class_id,
                    'classwork_slug' => $classwork->slug,
                    'class_slug' => $classwork->classroom->slug,
                ]),
                'read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }



        // event(new ClassworkSent([
        //     'id' => $comment->id ?? null,
        //     'class_id' =>  $classroom['id'],
        //     'class_slug' => $classroom['slug'],
        //     'other_id' =>  $classworkId,
        //     'title' => "New Class Comment",
        //     'message' => 'Message: ' .  $content,
        //     'className' =>  'Class: ' . $classroom['class_name'],
        //     'time' => now()->toDateTimeString(),
        //     'type' => 'class-comment',
        // ]));
        return response()->json($comment, 201);
    }

    /**
     * Update the specified comment in storage.
     */
    public function update(Request $request, $classworkId, $id)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $comment = ClassworkClassComment::where('classwork_id', $classworkId)
            ->findOrFail($id);

        // Authorization check - only the comment creator can update
        $user = Auth::user();
        if ($comment->sender_type === 'teacher') {
            if ($user->isTeacher() && $comment->teacher_id !== $user->teacher->id) {
                abort(403, 'Unauthorized action.');
            }
        } else {
            if ($comment->user_id !== $user->id) {
                abort(403, 'Unauthorized action.');
            }
        }

        $comment->update([
            'content' => $request->content,
        ]);

        // Refresh relationships
        $comment->load(['user', 'teacher']);

        return response()->json($comment);
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy($classworkId, $id)
    {
        $classwork = getClassWorkId($classworkId);
        $comment = ClassworkClassComment::where('classwork_id', $classwork->id)
            ->findOrFail($id);

        // Authorization check - only the comment creator can delete
        // $user = Auth::user();
        // if ($comment->sender_type === 'teacher') {
        //     if ($user->isTeacher() && $comment->teacher_id !== $user->teacher->id) {
        //         abort(403, 'Unauthorized action.');
        //     }
        // } else {
        //     if ($comment->user_id !== $user->id) {
        //         abort(403, 'Unauthorized action.');
        //     }
        // }

        $comment->delete();

        return response()->json(null, 204);
    }
}
