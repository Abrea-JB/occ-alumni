<?php

namespace App\Http\Controllers\API;
use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Students;
use App\Models\User;
use App\Models\Users;
use DB;


class StudentsController extends Controller
{

    public function index(Request $request)
    {
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno-1) * $no_of_records_per_page;
        $list  = DB::select('SELECT  students.*,users.email FROM students INNER JOIN users ON students.user_id = users.id LIMIT '.$offset.', '.$no_of_records_per_page.' ');
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  students  ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'students'      => $list,
        );
        return response()->json($return, 200);
    }

    public function store(Request $request)
    {  
        $check = Users::whereEmail($request->email)->first();
        if($check){
            return response()->json([ 'result' => false, 'message' => "Email is not available!" ], 500);
        }
        DB::beginTransaction();
        try {
            if( isset($request->id) ){
                $user = new Students();
                $user->exists = true;
                $user->id = $request->id; 
                $user->fname = $request->fname; 
                $user->lname = $request->lname; 
                $user->mname = $request->mname; 
                $user->phone = $request->phone; 
                $user->save();
                DB::commit();
                return response()->json([ 'result' => true, 'message' => "Saved!" ], 200);
            }
            $user = Users::create([
                "name" => $request->fname . ' ' . $request->fname,
                "email" => $request->email,
                "password" => $request->password,
            ]);
            Students::create([
               "user_id" => $user->id,
               "fname" => $request->fname,
               "lname" => $request->lname,
               "mname" => $request->mname,
               "phone" => $request->phone,
            ]);
           DB::commit();
         return response()->json([ 'result' => true, 'message' => "Stored!" ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'result' => false, 'message' => $e->getMessage() ], 500);
        }
    }
 
    
}
