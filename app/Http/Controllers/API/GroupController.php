<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Groups;
use App\Models\GroupDetails;
use App\Models\Thesis;
use App\Models\Users;
use App\Models\Students;
use DB;


class GroupController extends Controller
{
    public function index(Request $request)
    {
        $user = auth('api')->user(); 
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno-1) * $no_of_records_per_page;
        if($user->role === 'admin'){
            $list  = DB::select('SELECT * FROM groups LIMIT '.$offset.', '.$no_of_records_per_page.' ');
        }
        if($user->role === 'faculty'){
            $id= $user->id;
            $list  = DB::select('SELECT * FROM groups where faculty_id='.$id.' LIMIT '.$offset.', '.$no_of_records_per_page.' ');
        }
        foreach($list as  $key => $k){
            $group_students = GroupDetails::where('group_id', $k->id)->get();
            $students = [];
            foreach($group_students as  $key2 => $group_student){
                $students[$key2] = Students::select('students.*','users.image')->join('users',  'users.id', '=',  'students.user_id')->where('students.id',$group_student->student_id)->first();
            }
            $list[$key]->students = $students;
        }
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  groups  ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'groups'      => $list,
        );
        return response()->json($return, 200);
    }

    public function list()
    {
        $groups = Groups::orderBy('groups.id','ASC')->get();
        $group_list=[];
        foreach  ($groups as $k){
            $group_check=Groups::leftJoin('thesis','thesis.group_id','=','groups.id')->where('thesis.group_id',$k->id)->orderBy('groups.id','ASC')->groupBy('groups.id')->first();
            if(!$group_check){
                array_push($group_list,  (object)[
                    'id'=> $k->id,
                    'group_name'=> $k->group_name,
                ]);
            }
            
        }
       
        return response()->json(['result' => true, 'groups' =>  $group_list], 200);
    }

    public function thesisGroup()
    {
        $groups = Thesis::with('group')->with('groupDetails')->where('status','active')->inRandomOrder()->get();
        foreach($groups as  $key=> $group){
            $students = [];
            // foreach($group->groupDetails as  $key2=> $group2){
            //     $students[$key2] =  Students::where('id', $group2->student_id)->first();
            // }
            // $groups[$key]->students = $students;
            $group_students = GroupDetails::where('group_id', $group->group_id)->get();
            $students = [];
            foreach($group_students as  $key2 => $group_student){
                $students[$key2] = Students::select('students.*','users.image')->join('users',  'users.id', '=',  'students.user_id')->where('students.id',$group_student->student_id)->first();
            }
            $groups[$key]->students = $students;
            
        }
        return response()->json(['result' => true, 'groups' =>  $groups], 200);
    }

    public function store(Request $request)
    {    
        DB::beginTransaction();
        $group_name=strtoupper($request->group_name);
        try {
            if( isset($request->id) ){
                try {
                    DB::table('group_details')->where('group_id', $request->id)->delete();
                    $students =  $request->students;
                    Groups::where('id', $request->id)
                    ->update([
                        "group_name" => $group_name,
                        "faculty_id" => $request->faculty_id,
                        "team_lead" => $students[0]["value"],
    
                    ]);
                    for ($i=0; $i < count($students); $i++) { 
                        $check_member=GroupDetails::leftJoin('groups','groups.id','=','group_details.group_id')->where('student_id',$students[$i]["value"])->first();
                        if($check_member){
                            return response()->json([ 'result' => false, 'message' =>  $students[$i]["label"].' '.'belongs to a group already!'], 500);
                        }
                    }
                    for ($i=0; $i < count($students); $i++) { 
                        GroupDetails ::create([
                            "group_id" => $request->id,
                            "student_id" => $students[$i]["value"],
                            
                        ]);
                    }
                    DB::commit();
                    return 'updated';
                }catch (\Exception $e) {
                    DB::rollback();
                    return response()->json([ 'result' => false, 'message' => $e->getMessage() ], 400);
                }
            }
            $students =  $request->students;
            $group = Groups::create([
                "group_name" => $group_name,
                "faculty_id" => $request->faculty_id,
                "team_lead" => $students[0]["value"],
                "year_added" => date('Y'),
            ]);
            for ($i=0; $i < count($students); $i++) { 
                $check_member=GroupDetails::leftJoin('groups','groups.id','=','group_details.group_id')->where('student_id',$students[$i]["value"])->first();
                if($check_member){
                    return response()->json([ 'result' => false, 'message' =>  $students[$i]["label"].' '.'belongs to a group already!'], 500);
                }
            }
            for ($i=0; $i < count($students); $i++) { 
                GroupDetails::create([
                    "group_id" => $group->id,
                    "student_id" => $students[$i]["value"],
                ]);
            }
           
           DB::commit();
           return 'created';
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'result' => false, 'message' => $e->getMessage() ], 500);
        }
    }
 
    public function createAccount(Request $request)
    {  
        $check = Users::whereEmail($request->email)->first();
        if($check){
            return response()->json([ 'result' => false, 'message' => "Email is not available!" ], 500);
        }
        DB::beginTransaction();
        try {
            
            $user = Users::create([
                "name" => $request->group_name,
                "email" => $request->email,
                "password" => bcrypt($request->password),
            ]);
            Groups::where('id', $request->group_id)
            ->update(['user_id' => $user->id]);
           DB::commit();
         return response()->json([ 'result' => true, 'message' => "Stored!" ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'result' => false, 'message' => $e->getMessage() ], 500);
        }
    }

    public function facultyGroupList(Request $request)
    {
        $user = auth('api')->user(); 
        $id= $user->id;
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno-1) * $no_of_records_per_page;
        $list  = DB::select('SELECT * FROM groups where faculty_id='.$id.' LIMIT '.$offset.', '.$no_of_records_per_page.' ');
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  groups  ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'groups'      => $list,
        );
        return response()->json($return, 200);
    }
}
