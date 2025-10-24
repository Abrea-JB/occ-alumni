<?php

namespace App\Http\Controllers\API;
use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employees;
use App\Models\Users;
use DB;


class EmployeesController extends Controller
{
    public function index(Request $request)
    {
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno-1) * $no_of_records_per_page;
        $list  = DB::select('SELECT * FROM employees INNER JOIN users
        ON employees.user_id = users.id LIMIT '.$offset.', '.$no_of_records_per_page.' ');
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  employees  ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'employees'      => $list,
        );
        return response()->json($return, 200);
    }

    public function store(Request $request)
    {  
        DB::beginTransaction();
        try {
            if( isset($request->id) ){
                try {
                    DB::table('users')
                    ->where('id',$request->id)
                    ->update([
                        'email'     => $request->email,
                    ]);
                    DB::table('employees')
                    ->where('user_id',$request->id)
                    ->update([
                        'fname'     => $request->fname,
                        'lname'     => $request->lname,
                        'address'     => $request->address,
                        'contact_number'     => $request->contact_number,
                    ]);
                    DB::commit();
                    return response()->json([ 'result' => true, 'message' => "Service updated" ], 200);
                }catch (\Exception $e) {
                    DB::rollback();
                    return response()->json([ 'result' => false, 'message' => $e->getMessage() ], 400);
                }
                /*
                $user = new Users();
                $user->exists = true;
                $user->id = $request->id; 
                $user->email = $request->email; 
                $user->save();

                $employee = new Employees();
                $employee->exists = true;
                $employee->id = $request->id; 
                $employee->fname = $request->fname; 
                $employee->save();
                DB::commit();
                return response()->json([ 'result' => true, 'message' => "Saved!" ], 200);*/
            }
            $user = Users::create([
                "name" => $request->fname,
                "email" => $request->email,
                "role" => 1,
                "password" => bcrypt('123'),
            ]);
            $employee = Employees::create([
                "user_id" => $user->id,
                "fname" => $request->fname,
                "lname" => $request->lname,
                "contact_number" => $request->contact_number,
                "address" => $request->address,
            ]);
           DB::commit();
         return response()->json([ 'result' => true, 'message' => "Stored!" ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'result' => false, 'message' => $e->getMessage() ], 500);
        }
    }
 
    
}
