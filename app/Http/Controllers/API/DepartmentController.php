<?php

namespace App\Http\Controllers\API;
use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Users;
use DB;


class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno-1) * $no_of_records_per_page;
        $filters_query = '';
        $keyword = $request->keyword;
        if($keyword){
            $filters_query =  "WHERE   CONCAT(department.dept_name, college.college_name, department.id) LIKE '%{$keyword}%' ";
        }
        $list  = DB::select('SELECT department.dept_name AS dept_name, department.id AS id, department.college_id AS cid, college.college_name as college_name FROM department INNER JOIN college ON department.college_id = college.id  '.$filters_query.'  ORDER BY department.dept_name ASC   LIMIT '.$offset.', '.$no_of_records_per_page.' ');
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  department  INNER JOIN college ON department.college_id = college.id '.$filters_query.' ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'departments'      => $list,
        );
        return response()->json($return, 200);
    }

    public function storeDepartment(Request $request)
    {
        DB::beginTransaction();
        $dept_name=strtoupper($request->dept_name);
        try {
            if (isset($request->id)) {
                try {
                    Department::where('id', $request->id)
                        ->update([
                            'dept_name' => $dept_name,
                            "college_id" => $request->college_id,
                        ]);
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

    
 
    
}
