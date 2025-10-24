<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InlineComments;
use App\Models\ThesisDoc;
use App\Models\Thesislogs;
use DB;


class InlineCommentController extends Controller
{

    public function index($id)
    { 
        return InlineComments::where('doc_id',$id)->orderBy('id','desc')->get();
    }

    public function store(Request $request)
    {    
        DB::beginTransaction();
        try {
            // if (isset($request->id)) {
            //     try {
            //         InlineComments::where('id', $request->id)
            //             ->update([
            //                 'dept_name' => $dept_name,
            //                 "college_id" => $request->college_id,
            //             ]);
            //         DB::commit();
            //         return 'updated';
            //     } catch (\Exception $e) {
            //         DB::rollback();
            //         return response()->json(['result' => false, 'message' => $e->getMessage()], 400);
            //     }
            // }
            $data = InlineComments::create([
                "doc_id" =>$request->id,
                "comments" => $request->comment,
            ]);
            $doc=ThesisDoc::where('id', $request->id)->first();
            Thesislogs::create([
                "thesis_id" =>   $doc->thesis_id,
                "log" =>  "Faculty Added Inline Comments",
            ]);
            DB::commit();
            return $data->id;
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function delete(Request $request)
    { 
        $inline=InlineComments::where('id', $request->id)->first();
        $doc=ThesisDoc::where('id', $inline->doc_id)->first();
        Thesislogs::create([
            "thesis_id" =>   $doc->thesis_id,
            "log" =>  "Faculty Deleted Inline Comments",
        ]);
        InlineComments::where('id',$request->id)->delete();
    }

}
