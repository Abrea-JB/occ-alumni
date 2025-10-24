<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employees;
use App\Models\Department;
use App\Models\Semester;
use App\Models\Users;
use App\Models\Schoolyear;
use App\Models\College;
use App\Models\Thesis;
use App\Models\Groups;
use DB;


class CollegeController extends Controller
{
    public function index(Request $request)
    {
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno - 1) * $no_of_records_per_page;
        $keyword = $request->keyword;
        $filters_query = '';
        if($keyword){
            $filters_query =  "WHERE   CONCAT(college_name, id) LIKE '%{$keyword}%' ";
        }
        $list  = DB::select('SELECT * FROM college   '.$filters_query.'  ORDER BY college_name ASC   LIMIT ' . $offset . ', ' . $no_of_records_per_page . ' ');
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  college  '.$filters_query.' ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'colleges'      => $list,
        );
        return response()->json($return, 200);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        $college_name=strtoupper($request->college_name);
        try {
            if (isset($request->id)) {
                try {
                    College::where('id', $request->id)
                        ->update(['college_name' => $college_name]);
                    DB::commit();
                    return 'updated';
                } catch (\Exception $e) {
                    DB::rollback();
                    return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
                }
            }
            $college = College::create([
                "college_name" => $college_name,
            ]);
            DB::commit();
            return 'created';
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getDepartments($id)
    {
        $departments = Department::where('college_id',$id)->get();
        return response()->json(['result' => true, 'departments' =>  $departments], 200);
    }

    public function getSchoolyears()
    {
        $schoolyear = Schoolyear::orderBy('id','ASC')->get();
        return response()->json(['result' => true, 'schoolyear' =>  $schoolyear], 200);
    }

    public function getSemesters()
    {
        $semester = Semester::orderBy('year','ASC')->get();
        return response()->json(['result' => true, 'semesters' =>  $semester], 200);
    }

    public function storeDepartment(Request $request)
    {
        DB::beginTransaction();
        $dept_name=strtoupper($request->dept_name);
        try {
            if (isset($request->id)) {
                try {
                    Department::where('id', $request->id)
                        ->update(['dept_name' => $dept_name]);
                    DB::commit();
                    return 'updated';
                } catch (\Exception $e) {
                    DB::rollback();
                    return response()->json(['result' => false, 'message' => $e->getMessage()], 400);
                }
            }
            Department::create([
                "dept_name" => $dept_name,
                "college_id" => $request->college_id,
            ]);
            DB::commit();
            return 'created';
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function storeThesis(Request $request)
    {  
        DB::beginTransaction();
        try {
            // $document= $request->document; 
            // $fileName =  "doc-".time().'.'.$document->getClientOriginalExtension();
            // $document_name =  $document->getClientOriginalName();
            // $document->move(public_path('uploads/documents'), $fileName);
            $faculty=Groups::where('id',$request->group)->first();

            Thesis::create([
                "sy_id" => $request->sy_id,
                //"sem_id" => $request->sem_id,
                "thesis_name" => $request->thesis_name,
                //"adviser" => $request->adviser,
                "group_id" => $request->group,
                "faculty_id" => $faculty->faculty_id,
                //"thesis_description" => $request->thesis_description,
                // "document" => $fileName, 
                // "document_name" => $document_name,
            ]);
            DB::commit();
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function storeSY(Request $request)
    {  
        DB::beginTransaction();
        $year_1 = Schoolyear::where("year", $request->year_1)->first();
        if(!isset($request->id)){
            if (!$year_1) {
                try {
                    if (isset($request->id)) {
                        try {
                            Schoolyear::where('id', $request->id)
                                ->update([ 
                                    "year" => $request->year_1,
                                    "year2" => $request->year_2,
                                ]);
                            DB::commit();
                            return response()->json(['result' => true, 'message' => "updated"], 200);
                        } catch (\Exception $e) {
                            DB::rollback();
                            return response()->json(['result' => false, 'message' => $e->getMessage()], 400);
                        }
                    }
                $sy=$request->year_1.'-'.$request->year_2;
                    Schoolyear::create([
                        "year" => $request->year_1,
                        "year2" => $request->year_2,
                    ]);
                    DB::commit();
                    return response()->json(['result' => true, 'message' => "saved!"], 200);
                } catch (\Exception $e) {
                    DB::rollback();
                    return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
                }
            }
            if ($year_1) {
                return 'exist';
            }
        }
        if(isset($request->id)){
           try {
            Schoolyear::where('id', $request->id)
                ->update([
                    "year" => $request->year_1,
                    "year2" => $request->year_2,
                ]);
                DB::commit();
                return 'updated';
            } catch (\Exception $e) {
                DB::rollback();
                return response()->json(['result' => false, 'message' => $e->getMessage()], 400);
            }
               
                
              
        
        }
    }

    public function getDepartmentList()
    {
        $departments = Department::orderBy('id','ASC')->get();
        return response()->json(['result' => true, 'departments' =>  $departments], 200);
    }

    public function getCollegetList()
    {
        $college = College::orderBy('id','ASC')->get();
        return response()->json(['result' => true, 'colleges' =>  $college], 200);
    }

    
}
