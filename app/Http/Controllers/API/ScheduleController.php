<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Auth;
use Dotenv\Validator as DotenvValidator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DefenseShedule;
use App\Models\DefenseThesisDetails;
use App\Models\ConceptPaperRating;
use App\Models\Thesis;
use App\Models\Groups;
use App\Models\GroupDetails;
use App\Models\DefensePanel;
use App\Models\DefensePanelFaculty;
use App\Models\Notifications;
use App\Models\Faculties;
use Barryvdh\DomPDF\Facade\Pdf;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Models\Thesislogs;
use App\Models\Schoolyear;
use App\Models\Semester;
use App\Models\ThesisStages;
use App\Models\College;
use App\Models\Department;
use DB;


class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $scedules = DefenseShedule::where('end_date', '>=', date('Y-m-d'))->with('sched_details')->get();
        foreach ($scedules as  $key => $scedule) {
            $thesis = [];
            foreach ($scedule->sched_details as  $key2 => $group2) {
                //$thesis[$key2] =  $group_student = Thesis::where('id', $group2->thesis_id)->first();
                $scedule->sched_details[$key2]->thesis =  Thesis::select('thesis_name')->where('id', $group2->thesis_id)->first();
            }
        }
        $return = array(
            'schedules'      => $scedules,
        );
        return response()->json($return, 200);
    }

    public function create(Request $request)
    {
        DB::beginTransaction();
        try {
            $times = $request->dateTimeGroups;
            $dates = $request->dates;
            $start_date = $dates[0]['date'];
            $end_date = $dates[count($dates) - 1]['date'];
            // $date_array = [];
            $sched = DefenseShedule::create([
                "start_date" => $start_date,
                "end_date" => $end_date,
                "stage_id" => $request->stage_id,
                "sy_id" => $request->sy,
                "sem_id" => $request->sem,
            ]);

            foreach ($times as $i =>  $time) {
                $thesis = 0;
                if (array_key_exists('thesis', $time)) {
                    $time_value = '';
                    // $time_value = $time['time']['value'];
                    $thesis = $time['thesis'];
                } else {
                    $thesis = 0;
                }
                $time_value = $time['time']['value'];
                if (isset($thesis['id'])) {
                    $thesis_id = $thesis['id'];
                    $group_id = $thesis['group']['id'];
                    $defense_thesis_details = DefenseThesisDetails::create([
                        "defense_sched_id" =>  $sched->id,
                        "thesis_id" => $thesis_id,
                        "date_sched" => $time['date'],
                        "time" => $time_value,
                        // "start_time" => date("h:i A", strtotime($time['start_time'])),
                        // "end_time" => date("h:i A", strtotime($time['end_time'])),
                    ]);
                    Thesislogs::create([
                        "thesis_id" =>    $thesis_id,
                        "log" =>  "New defense schedule",
                    ]);
                    $user = auth('api')->user();
                    $thesis = Thesis::where('id', $thesis_id)->first();
                    $faculty = Faculties::where('id', $thesis->faculty_id)->first();
                    $group = Groups::where('groups.id', $thesis->group_id)
                        ->leftJoin('group_details', 'group_details.group_id', '=', 'groups.id')
                        ->leftJoin('students', 'students.id', '=', 'group_details.student_id')
                        ->get();
                    foreach ($group as $k) {
                        $notifications = Notifications::create([
                            "user_id" =>   $k->user_id,
                            "user_id_from" =>  0,
                            "notification" =>  'newSchedule',
                            "status" =>  'unseen'
                        ]);
                    }
                } else {
                    $thesis_id = 0;
                    $group_id = 0;

                    $defense_thesis_details = DefenseThesisDetails::create([
                        "defense_sched_id" =>  $sched->id,
                        "thesis_id" => 0,
                        "date_sched" => $time['date'],
                        "time" => $time_value,
                        // "start_time" => date("h:i A", strtotime($time['start_time'])),
                        // "end_time" => date("h:i A", strtotime($time['end_time'])),
                    ]);
                }

                // $date_array[$i]['date'] =   $time['date'];
                // $date_array[$i]['group'] =  $group_id;
                // $date_array[$i]['time'] =  $time_value;


                // $notifications=Notifications::create([
                //     "user_id" =>  $faculty->id,
                //     "notification" =>  'newSchedule',
                //      "user_id_from" =>  0,
                //     "status" =>  'unseen'
                // ]);

                if (isset($thesis['id'])) {
                    if ($thesis->stage_id != 1) {
                        //$panel = DefensePanel::where('defense_sched_details_id', $defense_thesis_details->id)->first();
                        $panel = DefensePanel::create([
                            "defense_sched_details_id" => $defense_thesis_details->id,
                        ]);
                        DefensePanelFaculty::create([
                            "faculty_id" => $thesis->faculty_id,
                            "defense_panel_id" => $panel->id,
                        ]);
                        // $notifications=Notifications::create([
                        //     "user_id" =>   $thesis->faculty_id,
                        //     "notification" =>  'schedToday',
                        //     "user_id_from" =>  0,
                        //     "status" =>  'unseen'
                        // ]);
                    }
                }

                // $panel_list=DefensePanel::where('defense_sched_details_id',$defense_thesis_details->id)
                // ->leftJoin('defense_panel_faculty', 'defense_panel_faculty.defense_panel_id', '=', 'defense_panel.id')
                // ->get();


                // }
                //}
            }

            // $panel = DefensePanel::where('defense_sched_details_id', $request->defense_sched_details_id)->first();
            // if (!$panel) {
            //     $panel = DefensePanel::create([
            //         "defense_sched_details_id" => $request->defense_sched_details_id,
            //     ]);
            // } else {
            //     DefensePanelFaculty::where('defense_panel_id', $panel->id)->delete();
            // }
            // foreach ($request->faculty as $key => $faculty_id) {
            //     DefensePanelFaculty::create([
            //         "faculty_id" => $faculty_id,
            //         "defense_panel_id" => $panel->id,
            //     ]);
            // }

            DB::commit();
            return response()->json(['result' => true, 'message' => "saved!"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['result' => false, 'message' => $e->getMessage()], 500);
        }
    }
    public function reports(Request $request)
    {
        // $scedules = DefenseShedule::where('end_date', '>=',date('Y-m-d'))->with('sched_details')->get();
        // foreach($scedules as  $key=> $scedule){
        //     $thesis = [];
        //     foreach($scedule->sched_details as  $key2=> $group2){
        //         //$thesis[$key2] =  $group_student = Thesis::where('id', $group2->thesis_id)->first();
        //         $scedule->sched_details[$key2]->thesis =  Thesis::select('thesis_name')->where('id', $group2->thesis_id)->first();
        //     }
        // }
        // $return = array(
        //     'schedules'      => $scedules,
        // );

        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno - 1) * $no_of_records_per_page;
        $keyword = $request->keyword;
        $filters_sy = '';
        $filters_sem = '';
        $filters_category = '';
        $filters_college='';
        $filters_dept='';
        if (isset($request->filter['sy'])) {
            $sy = $request->filter['sy'];
            $filters_sy = "and  defense_sched.sy_id = '$sy' ";
        }
        if (isset($request->filter['sem'])) {
            $sem = $request->filter['sem'];
            $filters_sy = "and  sem_id  = '$sem' ";
        }
        if (isset($request->filter['category'])) {
            $category = $request->filter['category'];
            $filters_category = "and  defense_sched.stage_id   = '$category' ";
        }
        if (isset($request->filter['college_id'])) {
            $college = $request->filter['college_id'];
            $filters_college = "and  college_id    = '$college' ";
        }
        if (isset($request->filter['department_id'])) {
            $dept = $request->filter['department_id'];
            $filters_dept = "and  department_id   = '$dept' ";
        }
        $list  = DB::select('SELECT  *  FROM defense_sched LEFT JOIN defense_thesis_details ON defense_thesis_details.defense_sched_id  = defense_sched.id LEFT JOIN thesis ON thesis.id  = defense_thesis_details.thesis_id LEFT JOIN groups ON groups.id  = thesis.group_id LEFT JOIN students ON students.id  = groups.team_lead  where defense_sched.id !=0'. ' '. $filters_sy . ' '. $filters_sem .' '. $filters_category.' '. $filters_college.' '. $filters_dept.' GROUP BY defense_sched_id LIMIT ' . $offset . ', ' . $no_of_records_per_page . '  ');
        $total_rows = DB::select('SELECT  COUNT(*) AS total  FROM defense_sched LEFT JOIN defense_thesis_details ON defense_thesis_details.defense_sched_id  = defense_sched.id LEFT JOIN thesis ON thesis.id  = defense_thesis_details.thesis_id LEFT JOIN groups ON groups.id  = thesis.group_id LEFT JOIN students ON students.id  = groups.team_lead  where defense_sched.id !=0'. ' '. $filters_sy . ' '. $filters_sem .' '. $filters_category.' '. $filters_college.' '. $filters_dept.' GROUP BY defense_thesis_details.defense_sched_id  ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'schedules'     => $list,
            // 'url'           => URL::to('/'),
        );
        return response()->json($return, 200);
    }

    public function report(Request $request)
    {
        $pageno = intval($request->page) + 1;
        $no_of_records_per_page = $request->per_page;
        $offset = ($pageno - 1) * $no_of_records_per_page;
        //$list  = DB::select('SELECT * FROM defense_sched  LIMIT ' . $offset . ', ' . $no_of_records_per_page . ' ');
        $list  = DB::select('SELECT defense_thesis_details.*,thesis.thesis_name  FROM defense_thesis_details INNER JOIN thesis ON defense_thesis_details.thesis_id = thesis.id   LIMIT ' . $offset . ', ' . $no_of_records_per_page . ' ');
        $total_rows = DB::select('SELECT COUNT(*) AS total FROM  defense_thesis_details  ');
        $total_pages  = ceil($total_rows[0]->total);
        $return = array(
            'total'         => $total_pages,
            'per_page'      => $no_of_records_per_page,
            'page'          => $pageno,
            'report'      => $list,
        );
        return response()->json($return, 200);
    }

    public function reportDetails(Request $request)
    {
        $rating = ConceptPaperRating::where('concept_paper_rating.defense_thesis_details_id', $request->schedID)
            ->leftJoin('users', 'users.id', '=', 'concept_paper_rating.faculty_panel_id')
            ->leftJoin('thesis', 'thesis.id', '=', 'concept_paper_rating.thesis_id')
            ->leftJoin('groups', 'groups.id', '=', 'thesis.group_id')
            ->get();
        $defense_details = DefenseThesisDetails::where('id', $request->schedID)->first();
        $thesis = Thesis::where('id', $defense_details->thesis_id)->first();
        $groups = Groups::where('id', $thesis->group_id)->first();
        $proponents = GroupDetails::where('group_id', $groups->id)
            ->leftJoin('students', 'students.id', '=', 'group_details.student_id')
            ->get();
        $rating_research_topic = ConceptPaperRating::where('concept_paper_rating.defense_thesis_details_id', $request->schedID)->sum('research_topic');
        $rating_relevant_literature = ConceptPaperRating::where('concept_paper_rating.defense_thesis_details_id', $request->schedID)->sum('relevant_literature');
        $rating_issues_gap = ConceptPaperRating::where('concept_paper_rating.defense_thesis_details_id', $request->schedID)->sum('issues_gap');
        $rating_possibe_solutions = ConceptPaperRating::where('concept_paper_rating.defense_thesis_details_id', $request->schedID)->sum('possibe_solutions');
        $rating_overall_concept = ConceptPaperRating::where('concept_paper_rating.defense_thesis_details_id', $request->schedID)->sum('overall_concept');
        $total_rating = $rating_research_topic +  $rating_relevant_literature + $rating_issues_gap +  $rating_possibe_solutions + $rating_overall_concept;
        // foreach($rating as $k){
        //     $total_rating=$k->research_topic + $k->relevant_literature + $k->issues_gap + $k->possibe_solutions + $k->overall_concept ;
        // }
        $total_panel = sizeOf($rating);
        $return = array(
            'rating'     => $rating,
            'total_rating'     => $total_rating,
            'thesis'     => $thesis,
            'proponents'     => $proponents,
            'total_panel'     => $total_panel,
        );
        return response()->json($return, 200);
    }

    public function schedDetails(Request $request)
    {
        $defense_details = DefenseThesisDetails::where('defense_sched_id', $request->schedID)
        ->groupBy('date_sched')
        ->get();
        $sched = DefenseShedule::where('id', $request->schedID)->first();
        $thesis_list = [];
        $thesis_list_data = [];
        foreach ($defense_details as  $k) {
            DefenseThesisDetails::select('defense_thesis_details.*', 'thesis.id AS thesis_id', 'thesis_name', 'time', 'groups.id AS group_id', 'group_name', 'defense_thesis_details.id AS defense_thesis_details_id', 'defense_thesis_details.date_sched', 'defense_thesis_details.time')
                // ->where('date_sched',$k->date_sched) 
                ->where('defense_sched_id', $request->schedID)
                ->leftJoin('thesis', 'thesis.id', '=', 'defense_thesis_details.thesis_id')
                ->leftJoin('groups', 'groups.id', '=', 'thesis.group_id')
                ->groupBy('date_sched')
                ->get();
            array_push($thesis_list_data, (object)[
                'sched_date' => $k->date_sched,
                'id' => $request->schedID,
            ]);
            // array_push($thesis_list, (object)[
            //     'sched_date' => $k->date_sched,
            //     'sched_time' => $k->time,
            //     // 'defense_thesis_details_ID' => $k->id,
            //     'thesis' => $thesis_details,
            // ]);
        }

        foreach ($thesis_list_data  as $i2 =>  $k) {
            $thesis_details = DefenseThesisDetails::where('date_sched', $k->sched_date)->where('defense_sched_id', $k->id)->get();
            foreach ($thesis_details as $i =>   $details) {
                if (isset($details->thesis_id)) {
                    $rating_perSched = ConceptPaperRating::where('defense_thesis_details_id', $details->id)
                        ->leftJoin('users', 'users.id', '=', 'concept_paper_rating.faculty_panel_id')
                        ->get();
                    $research_topic = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('research_topic');
                    $relevant_literature = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('relevant_literature');
                    $issues_gap = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('issues_gap');
                    $possibe_solutions = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('possibe_solutions');
                    $overall_concept = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('overall_concept');
                    $total_panel = DefensePanel::select('defense_panel.*')
                        ->join('defense_panel_faculty', 'defense_panel_id', '=', 'defense_panel.id')
                        ->where('defense_sched_details_id', $details->id)
                        ->get();
                    $rating_sum = $research_topic + $relevant_literature + $issues_gap + $possibe_solutions + $overall_concept;

                    // $rating_average=$rating_sum/sizeOf($total_panel);
                    $color = '';
                    $remark = '';
                    if (sizeOf($total_panel) > 0) {
                        $rating_average = $rating_sum / sizeOf($total_panel);
                    } else {
                        $rating_average = 0;
                    }
                    if (sizeOf($rating_perSched) == sizeOf($total_panel)) {
                        if ($rating_average >= 75) {
                            $color = 'green';
                            $remark = 'PASSED';
                        }
                        if ($rating_average < 75) {
                            $color = 'red';
                            $remark = 'FAILED';
                        }
                    }
                    $thesis_details[$i]->group = Thesis::where('thesis.id', $details->thesis_id)
                    ->join('groups', 'groups.id', '=', 'thesis.group_id')
                    ->first();

                    $thesis_details[$i]->panels = DefensePanel::select('faculty.*', 'users.image', 'defense_panel.defense_sched_details_id')->where('defense_sched_details_id', $details->id)
                        ->join('defense_panel_faculty', 'defense_panel.id', '=', 'defense_panel_faculty.defense_panel_id')
                        ->join('users', 'users.id', '=', 'defense_panel_faculty.faculty_id')
                        ->join('faculty', 'faculty.user_id', '=', 'users.id')
                        // ->join('users', 'users.id', '=', 'faculty.user_id')
                        ->get();

                    $thesis_details[$i]->students = Thesis::where('thesis.id', $details->thesis_id)
                        ->join('groups', 'groups.id', '=', 'thesis.group_id')
                        ->join('group_details', 'group_details.group_id', '=', 'groups.id')
                        ->join('students', 'students.id', '=', 'group_details.student_id')
                        ->get();

                    $thesis_details[$i]->remark = $remark;
                    $thesis_details[$i]->color = $color;
                    $thesis_details[$i]->rating_average = $rating_average;
                    $thesis_details[$i]->rating_perSched = $rating_perSched;
                    $thesis_details[$i]->total_panel_has_rating = sizeOf($rating_perSched);
                    $thesis_details[$i]->total_panel = sizeOf($total_panel);
                    $thesis_details[$i]->rating_perSched = $rating_perSched;
                    $thesis_details[$i]->defense_thesis_details_id=$details->id;
                    // $thesis_details[$i]->defense_sched_id= $request->schedID;
                }
            }
            $thesis_list_data[$i2]->thesis = $thesis_details;
        }

        $return = array(
            'defense_sched_id'     => $request->schedID,
            'defense_details'     => $thesis_list_data,
            'start' => $sched->start_date,
            'end' => $sched->end_date,
        );
        return response()->json($return, 200);
    }

    public function reportTotal(Request $request)
    {
        $rating = ConceptPaperRating::where('faculty_panel_id', $request->facultyID)->where('defense_sched_id', $request->schedID)->get();
        $total_rating = 0;
        foreach ($rating as $k) {
            $total_rating = $k->research_topic + $k->relevant_literature + $k->issues_gap + $k->possibe_solutions + $k->overall_concept;
        }
        $return = array(
            'total_rating'     => $total_rating,
        );
        return response()->json($return, 200);
    }

    public function getProponents(Request $request)
    {
        $thesis = Thesis::where('thesis.id', $request->thesisID)->first();
        $groups = Groups::where('id', $thesis->group_id)->first();
        $data['proponents'] = GroupDetails::where('group_id', $groups->id)
            ->leftJoin('students', 'students.id', '=', 'group_details.student_id')
            ->get();
        return response()->json($data, 200);
    }

    public function scheduleViewDetails(Request $request)
    {
        $rating = ConceptPaperRating::where('defense_thesis_details_id', $request->defenseThesisDetailsId)
            ->leftJoin('users', 'users.id', '=', 'concept_paper_rating.faculty_panel_id')
            ->leftJoin('thesis', 'thesis.id', '=', 'concept_paper_rating.thesis_id')
            ->leftJoin('groups', 'groups.id', '=', 'thesis.group_id')
            ->get();
        $defense_details = DefenseThesisDetails::where('id', $request->defenseThesisDetailsId)->first();
        $thesis = Thesis::where('id', $request->thesisID)->first();
        $groups = Groups::where('id', $request->groupID)->first();
        $proponents = GroupDetails::where('group_id', $groups->id)
            ->leftJoin('students', 'students.id', '=', 'group_details.student_id')
            ->get();
        $rating_research_topic = ConceptPaperRating::where('defense_thesis_details_id', $request->defenseThesisDetailsId)->sum('research_topic');
        $rating_relevant_literature = ConceptPaperRating::where('defense_thesis_details_id', $request->defenseThesisDetailsId)->sum('relevant_literature');
        $rating_issues_gap = ConceptPaperRating::where('defense_thesis_details_id', $request->defenseThesisDetailsId)->sum('issues_gap');
        $rating_possibe_solutions = ConceptPaperRating::where('defense_thesis_details_id', $request->defenseThesisDetailsId)->sum('possibe_solutions');
        $rating_overall_concept = ConceptPaperRating::where('defense_thesis_details_id', $request->defenseThesisDetailsId)->sum('overall_concept');
        $total_rating = $rating_research_topic +  $rating_relevant_literature + $rating_issues_gap +  $rating_possibe_solutions + $rating_overall_concept;
        // foreach($rating as $k){
        //     $total_rating=$k->research_topic + $k->relevant_literature + $k->issues_gap + $k->possibe_solutions + $k->overall_concept ;
        // }
        $panel = DefensePanel::
        leftJoin('defense_panel_faculty', 'defense_panel_faculty.defense_panel_id', '=', 'defense_panel.id')
        ->leftJoin('faculty', 'faculty.id', '=', 'defense_panel_faculty.faculty_id')
        ->where('defense_sched_details_id', $request->defenseThesisDetailsId)
        ->get();
        $rating_perSched = ConceptPaperRating::where('defense_thesis_details_id', $request->defenseThesisDetailsId)
        ->leftJoin('users', 'users.id', '=', 'concept_paper_rating.faculty_panel_id')
        ->get();
        $total_panel = sizeOf($panel);
        $return = array(
            'rating'     => $rating,
            'total_rating'     => $total_rating,
            'thesis'     => $thesis,
            'proponents'     => $proponents,
            "total_panel_has_rating" => sizeOf($rating_perSched),
            'total_panel'     => $total_panel,
            'panel'     => $panel,
        );
        return response()->json($return, 200);
    }

    public function pdf(Request $request)
    {
        $defense_details = DefenseThesisDetails::where('defense_sched_id', $request->schedID)
            ->groupBy('date_sched')
            ->get();
        $sched = DefenseShedule::where('id', $request->schedID)->first();
        $thesis_list = [];
        foreach ($defense_details as  $k) {

            $thesis_details = DefenseThesisDetails::select('defense_thesis_details.*', 'thesis.id AS thesis_id', 'thesis_name', 'time', 'groups.id AS group_id', 'group_name')
                ->where('date_sched', $k->date_sched)
                ->leftJoin('thesis', 'thesis.id', '=', 'defense_thesis_details.thesis_id')
                ->leftJoin('groups', 'groups.id', '=', 'thesis.group_id')
                ->get();

            $rating = ConceptPaperRating::where('defense_sched_id', $request->schedID)
                ->where('thesis_id', $request->schedID)
                ->get();
            foreach ($thesis_details as $i => $thesis_detail) {
                $thesis_details[$i]->rating = ConceptPaperRating::where('defense_sched_id', $request->schedID)->where('thesis_id', $thesis_detail->thesis_id)->get();
            }
            array_push($thesis_list, (object)[
                'sched_date' => $k->date_sched,
                'sched_time' => $k->time,
                'thesis' => $thesis_details,
            ]);
        }
    }

    public function schedDetailsPdf($id)
    {
        $defense_details = DefenseThesisDetails::where('defense_sched_id', $id)
        ->groupBy('date_sched')
        ->get();
        $sched = DefenseShedule::where('id', $id)->first();
        $thesis_list = [];
        $thesis_list_data = [];
        foreach ($defense_details as  $k) {
            DefenseThesisDetails::select('defense_thesis_details.*', 'thesis.id AS thesis_id', 'thesis_name', 'time', 'groups.id AS group_id', 'group_name', 'defense_thesis_details.id AS defense_thesis_details_id', 'defense_thesis_details.date_sched', 'defense_thesis_details.time')
                // ->where('date_sched',$k->date_sched) 
                ->where('defense_sched_id', $id)
                ->leftJoin('thesis', 'thesis.id', '=', 'defense_thesis_details.thesis_id')
                ->leftJoin('groups', 'groups.id', '=', 'thesis.group_id')
                ->groupBy('date_sched')
                ->get();
            array_push($thesis_list_data, (object)[
                'sched_date' => $k->date_sched,
                'id' => $id,
            ]);
            // array_push($thesis_list, (object)[
            //     'sched_date' => $k->date_sched,
            //     'sched_time' => $k->time,
            //     // 'defense_thesis_details_ID' => $k->id,
            //     'thesis' => $thesis_details,
            // ]);
        }

        foreach ($thesis_list_data  as $i2 =>  $k) {
            $thesis_details = DefenseThesisDetails::where('date_sched', $k->sched_date)->where('defense_sched_id', $k->id)->get();
            foreach ($thesis_details as $i =>   $details) {
                if (isset($details->thesis_id)) {
                    $rating_perSched = ConceptPaperRating::where('defense_thesis_details_id', $details->id)
                        ->leftJoin('users', 'users.id', '=', 'concept_paper_rating.faculty_panel_id')
                        ->get();
                    $research_topic = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('research_topic');
                    $relevant_literature = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('relevant_literature');
                    $issues_gap = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('issues_gap');
                    $possibe_solutions = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('possibe_solutions');
                    $overall_concept = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('overall_concept');
                    $total_panel = DefensePanel::select('defense_panel.*')
                        ->join('defense_panel_faculty', 'defense_panel_id', '=', 'defense_panel.id')
                        ->where('defense_sched_details_id', $details->id)
                        ->get();
                    $rating_sum = $research_topic + $relevant_literature + $issues_gap + $possibe_solutions + $overall_concept;

                    // $rating_average=$rating_sum/sizeOf($total_panel);
                    $color = '';
                    $remark = '';
                    if (sizeOf($total_panel) > 0) {
                        $rating_average = $rating_sum / sizeOf($total_panel);
                    } else {
                        $rating_average = 0;
                    }
                    if (sizeOf($rating_perSched) == sizeOf($total_panel)) {
                        if ($rating_average >= 75) {
                            $color = 'green';
                            $remark = 'PASSED';
                        }
                        if ($rating_average < 75) {
                            $color = 'red';
                            $remark = 'FAILED';
                        }
                    }
                    $thesis_details[$i]->group = Thesis::where('thesis.id', $details->thesis_id)
                    ->join('groups', 'groups.id', '=', 'thesis.group_id')
                    ->first();

                    $thesis_details[$i]->panels = DefensePanel::select('faculty.*', 'users.image', 'defense_panel.defense_sched_details_id')->where('defense_sched_details_id', $details->id)
                        ->join('defense_panel_faculty', 'defense_panel.id', '=', 'defense_panel_faculty.defense_panel_id')
                        ->join('users', 'users.id', '=', 'defense_panel_faculty.faculty_id')
                        ->join('faculty', 'faculty.user_id', '=', 'users.id')
                        // ->join('users', 'users.id', '=', 'faculty.user_id')
                        ->get();

                    $thesis_details[$i]->students = Thesis::where('thesis.id', $details->thesis_id)
                        ->join('groups', 'groups.id', '=', 'thesis.group_id')
                        ->join('group_details', 'group_details.group_id', '=', 'groups.id')
                        ->join('students', 'students.id', '=', 'group_details.student_id')
                        ->get();

                    $thesis_details[$i]->remark = $remark;
                    $thesis_details[$i]->color = $color;
                    $thesis_details[$i]->rating_average = $rating_average;
                    $thesis_details[$i]->rating_perSched = $rating_perSched;
                    $thesis_details[$i]->total_panel_has_rating = sizeOf($rating_perSched);
                    $thesis_details[$i]->total_panel = sizeOf($total_panel);
                    $thesis_details[$i]->rating_perSched = $rating_perSched;
                    $thesis_details[$i]->defense_thesis_details_id=$details->id;
                    // $thesis_details[$i]->defense_sched_id= $request->schedID;
                }
            }
            $thesis_list_data[$i2]->thesis = $thesis_details;
        }

        // return $thesis_list_data;
        
                $logo="{{public_path('../assets/images/site-logo.png')}}";
                // return  '<html><img src="/../assets/images/site-logo.png" alt=""></html>';
                // <img src='.$logo.' alt="">
                $htmldoc = '
                    <html>
                        <head>
                            <title></title>
                            <style type="text/css">
                                body {
                                font-family: Times New Roman;
                                font-size: 15px;
                                }
                                .my-contract{
                                width:750px;
                                margin:0px auto;
                                }
                            </style>
                        </head>
                        <body style="margin: 1px">
                        <p style="font-size:20px;margin-bottom:12px" >University Of Science and Technology </p>
                        <p  style="margin-bottom:-12px;font-weight:bold">Defense Schedule</p>
                        <p style="margin-bottom:20px;" >'.date("F j, Y",strToTime($sched->start_date)).'-'.date("F j, Y",strToTime($sched->end_date)) .'</p>
                        <hr style={{border:"2px solid maroon",marginBottom:"10px",marginTop:"10px"}}></hr>
                            <table>
                                <thead>
                                    <tr>
                                        <th width="100px" align="center">Date</th>  
                                        <th width="150px" align="center">time</th> 
                                        <th width="175px" align="center">Group</th>
                                        <th width="250px" align="center">Proponents</th> 
                                        <th width="250px" align="center">Panels</th> 
                                    </tr>
                                </thead>
                                <tbody >    
                ';
                    
                    foreach($thesis_list_data as $k){
                        foreach($k->thesis as $k2){
                            $htmldoc.= ' 
                                <tr >
                                    <td width="" align="center" style="font-weight:;border:1px solid black">'.date('m-d-Y',strToTime($k2->date_sched)).'</td>
                                    <td width="230px" align="center" style="border:1px solid black">'.$k2->time.'</td>
                                
                            ';
                            if($k2->thesis_id ==0 && $k2->time != "12:00 PM - 1:00 PM"  ){
                                    $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">No Group Assigned
                                        </td>
                                    ';
                            }
                            if($k2->thesis_id !=0 && $k2->time != "12:00 PM - 1:00 PM"  ){
                                $htmldoc.= ' 
                                    <td width="" align="center" style="font-weight:;border:1px solid black">'. $k2->group->group_name.'
                                    </td>
                                ';
                                }
                                if($k2->time=== "12:00 PM - 1:00 PM"  ){
                                    $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">Lunch break
                                        </td>
                                    ';
                                }
                                $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">
                                        
                                ';
                                foreach($k2->students as $k3){
                                    if($k2->time==="12:00 PM - 1:00 PM"){
                                        $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">Lunch break
                                        </td>';
                                    }
                                    if($k2->time!="12:00 PM - 1:00 PM"){
                                        $htmldoc.= ''. $k3->fname .''. $k3->lname.'<br></br>';
                                    }
                                    
                                }
                                $htmldoc.= ' </td>';
                                $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">
                                        
                                ';
                                foreach($k2->panels as $k4){
                                    $htmldoc.= ''. $k4->fname .''. $k4->lname.'<br></br>';
                                }
                                $htmldoc.= ' </td>';
                                $htmldoc.= ' </tr>';
                                // $htmldoc.= '<hr style={{border:"1px solid gray",marginBottom:"10px",marginTop:"10px"}}></hr>';  
                        }
            }
            $htmldoc.= '</table></body></html>';
            $pdf =  Pdf::loadHTML($htmldoc)->setPaper('a4', 'landscape')->setWarnings(false);
            //return $pdf->stream('paymentReport'.'.pdf');
            return $pdf->stream('defense schedule('. date("F j, Y",strToTime($sched->start_date)).'-'.date("F j, Y",strToTime($sched->end_date)).')'.'.pdf');
            // return $pdf->download('schedule.pdf');
    }

    public function schedPdf($sy,$sem,$category,$college,$dept)
    {
        // $defense_details = DefenseThesisDetails::where('defense_sched_id', $id)
        // ->groupBy('date_sched')
        // ->get();
        $filters_sy = '';
        $filters_sem = '';
        $filters_category = '';
        $filters_college='';
        $filters_dept='';
        if ($sy!= 'undefined' &&  $sy!= 'null') {
            $sy = $sy;
            $filters_sy = "and  defense_sched.sy_id = ".$sy." ";
            //return  $filters_sy;
        }
        if ($sem!= 'undefined' && $sem!= 'null') {
            $sem = $sem;
            $filters_sem = "and  sem_id  = '$sem' ";
            //return  $filters_sem;
        }
        if ($category!= 'undefined' && $category!= 'null') {
            $category = $category;
            $filters_category = "and  defense_sched.stage_id   = ".$category." ";
            //return  $filters_category;
        }
        if ($college!= 'undefined' && $college!= 'null') {
            $college = $college;
            $filters_college = "and  college_id    = ".$college." ";
            //return $filters_college;
        }
        if ($dept!= 'undefined' && $dept!= 'null') {
            $dept = $dept;
            $filters_dept = "and  department_id   =  ".$dept." ";
            //return  $filters_dept;
        }
        $list  = DB::select('SELECT defense_sched.* FROM defense_sched LEFT JOIN defense_thesis_details ON defense_thesis_details.defense_sched_id  = defense_sched.id LEFT JOIN thesis ON thesis.id  = defense_thesis_details.thesis_id LEFT JOIN groups ON groups.id  = thesis.group_id LEFT JOIN students ON students.id  = groups.team_lead  where defense_sched.id !=0'. ' '. $filters_sy . ' '. $filters_sem .' '. $filters_category.' '. $filters_college.' '. $filters_dept.'GROUP BY defense_sched.id ');
        // $sched = DefenseShedule::where('id', $id)->first();
        $thesis_list = [];
        $thesis_list_data = [];
        // foreach ($list as  $k) {
        //     DefenseThesisDetails::select('defense_thesis_details.*', 'thesis.id AS thesis_id', 'thesis_name', 'time', 'groups.id AS group_id', 'group_name', 'defense_thesis_details.id AS defense_thesis_details_id', 'defense_thesis_details.date_sched', 'defense_thesis_details.time')
        //         // ->where('date_sched',$k->date_sched) 
        //         ->where('defense_sched_id', $id)
        //         ->leftJoin('thesis', 'thesis.id', '=', 'defense_thesis_details.thesis_id')
        //         ->leftJoin('groups', 'groups.id', '=', 'thesis.group_id')
        //         ->groupBy('date_sched')
        //         ->get();
        //     array_push($thesis_list_data, (object)[
        //         'sched_date' => $k->date_sched,
        //         'id' => $id,
        //     ]);
        //     // array_push($thesis_list, (object)[
        //     //     'sched_date' => $k->date_sched,
        //     //     'sched_time' => $k->time,
        //     //     // 'defense_thesis_details_ID' => $k->id,
        //     //     'thesis' => $thesis_details,
        //     // ]);
        // }
        $thesis_list_data=$list;
        foreach ($list  as $i2 =>  $k) {
            // return $k->id;
           $thesis_details = DefenseThesisDetails::where('defense_sched_id', $k->id)->get();
            foreach ($thesis_details as $i =>   $details) {
                $details->thesis_id;
                if (isset($details->thesis_id)) {
                    // $rating_perSched = ConceptPaperRating::where('defense_thesis_details_id', $details->id)
                    //     ->leftJoin('users', 'users.id', '=', 'concept_paper_rating.faculty_panel_id')
                    //     ->get();
                    // $research_topic = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('research_topic');
                    // $relevant_literature = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('relevant_literature');
                    // $issues_gap = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('issues_gap');
                    // $possibe_solutions = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('possibe_solutions');
                    // $overall_concept = ConceptPaperRating::select('concept_paper_rating.research_topic')->where('defense_thesis_details_id', $details->id)->sum('overall_concept');
                    // $total_panel = DefensePanel::select('defense_panel.*')
                    //     ->join('defense_panel_faculty', 'defense_panel_id', '=', 'defense_panel.id')
                    //     ->where('defense_sched_details_id', $details->id)
                    //     ->get();
                    // $rating_sum = $research_topic + $relevant_literature + $issues_gap + $possibe_solutions + $overall_concept;

                    // // $rating_average=$rating_sum/sizeOf($total_panel);
                    // $color = '';
                    // $remark = '';
                    // if (sizeOf($total_panel) > 0) {
                    //     $rating_average = $rating_sum / sizeOf($total_panel);
                    // } else {
                    //     $rating_average = 0;
                    // }
                    // if (sizeOf($rating_perSched) == sizeOf($total_panel)) {
                    //     if ($rating_average >= 75) {
                    //         $color = 'green';
                    //         $remark = 'PASSED';
                    //     }
                    //     if ($rating_average < 75) {
                    //         $color = 'red';
                    //         $remark = 'FAILED';
                    //     }
                    // }
                    $thesis_details[$i]->group = Thesis::where('thesis.id', $details->thesis_id)
                    ->join('groups', 'groups.id', '=', 'thesis.group_id')
                    ->first();

                    $thesis_details[$i]->panels = DefensePanel::select('faculty.*', 'users.image', 'defense_panel.defense_sched_details_id')->where('defense_sched_details_id', $details->id)
                        ->join('defense_panel_faculty', 'defense_panel.id', '=', 'defense_panel_faculty.defense_panel_id')
                        ->join('users', 'users.id', '=', 'defense_panel_faculty.faculty_id')
                        ->join('faculty', 'faculty.user_id', '=', 'users.id')
                        // ->join('users', 'users.id', '=', 'faculty.user_id')
                        ->get();

                    $thesis_details[$i]->students = Thesis::where('thesis.id', $details->thesis_id)
                        ->join('groups', 'groups.id', '=', 'thesis.group_id')
                        ->join('group_details', 'group_details.group_id', '=', 'groups.id')
                        ->join('students', 'students.id', '=', 'group_details.student_id')
                        ->get();

                    // $thesis_details[$i]->remark = $remark;
                    // $thesis_details[$i]->color = $color;
                    // $thesis_details[$i]->rating_average = $rating_average;
                    // $thesis_details[$i]->rating_perSched = $rating_perSched;
                    // $thesis_details[$i]->total_panel_has_rating = sizeOf($rating_perSched);
                    // $thesis_details[$i]->total_panel = sizeOf($total_panel);
                    // $thesis_details[$i]->rating_perSched = $rating_perSched;
                    $thesis_details[$i]->defense_thesis_details_id=$details->id;
                    // $thesis_details[$i]->defense_sched_id= $request->schedID;
                }
            }
            
            $thesis_list_data[$i2]->thesis = $thesis_details;
        }

        // return $thesis_list_data;
        
                $logo="{{public_path('../assets/images/site-logo.png')}}";
                // return  '<html><img src="/../assets/images/site-logo.png" alt=""></html>';
                // <img src='.$logo.' alt="">
                $htmldoc = '
                    <html>
                        <head>
                            <title></title>
                            <style type="text/css">
                                body {
                                font-family: Times New Roman;
                                font-size: 15px;
                                }
                                .my-contract{
                                width:750px;
                                margin:0px auto;
                                }
                            </style>
                        </head>
                        <body style="margin: 1px">
                        <p style="font-size:20px;margin-bottom:12px" >University Of Science and Technology </p>
                        <p  style="margin-bottom:-12px;font-weight:bold;font-size:18px">Defense Schedule</p>
                ';
                if ($sy!= 'undefined' &&  $sy!= 'null') {
                    $school_year=Schoolyear::where('id',$sy)->first();
                    $htmldoc .= '<p  style="margin-bottom:-12px;font-weight:bold">SY:<span style="font-weight:normal">'.$school_year->year.'-'.$school_year->year2 .'</span></p> ';
                }
                if ($sem!= 'undefined' &&  $sem!= 'null') {
                    $sem=Semester::where('id',$sem)->first();
                    $htmldoc .= '<p  style="margin-bottom:-12px;font-weight:bold">Sem:<span style="font-weight:normal">'.$sem->semester.'</span></p> ';
                }
                if ($category!= 'undefined' &&  $category!= 'null') {
                    $category=ThesisStages::where('id',$category)->first();
                    $htmldoc .= '<p  style="margin-bottom:-12px;font-weight:bold">Category:<span style="font-weight:normal">'.$category->name.'</span></p> ';
                }
                if ($college!= 'undefined' &&  $college!= 'null') {
                    $college=College::where('id',$college)->first();
                    $htmldoc .= '<p  style="margin-bottom:-12px;font-weight:bold">College:<span style="font-weight:normal">'.$college->college_name.'</span></p> ';
                }
                if ($dept!= 'undefined' &&  $dept!= 'null') {
                    $dept=Department::where('id',$dept)->first();
                    $htmldoc .= '<p  style="margin-bottom:0px;font-weight:bold">Department:<span style="font-weight:normal">'.$dept->dept_name.'</span></p> ';
                }
                $htmldoc .='
                        <hr style={{border:"2px solid maroon",marginBottom:"10px",marginTop:"10px"}}></hr>
                            <table>
                                <thead>
                                    <tr>
                                        <th width="100px" align="center">Date</th>  
                                        <th width="150px" align="center">time</th> 
                                        <th width="175px" align="center">Group</th>
                                        <th width="250px" align="center">Proponents</th> 
                                        <th width="250px" align="center">Panels</th> 
                                    </tr>
                                </thead>
                                <tbody >    
                ';
                    
                    foreach($thesis_list_data as $k){
                        foreach($k->thesis as $k2){
                            $htmldoc.= ' 
                                <tr >
                                    <td width="" align="center" style="font-weight:;border:1px solid black">'.date('m-d-Y',strToTime($k2->date_sched)).'</td>
                                    <td width="230px" align="center" style="border:1px solid black">'.$k2->time.'</td>
                                
                            ';
                            if($k2->thesis_id ==0 && $k2->time != "12:00 PM - 1:00 PM"  ){
                                    $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">No Group Assigned
                                        </td>
                                    ';
                            }
                            if($k2->thesis_id !=0 && $k2->time != "12:00 PM - 1:00 PM"  ){
                                $htmldoc.= ' 
                                    <td width="" align="center" style="font-weight:;border:1px solid black">'. $k2->group->group_name.'
                                    </td>
                                ';
                                }
                                if($k2->time=== "12:00 PM - 1:00 PM"  ){
                                    $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">Lunch break
                                        </td>
                                    ';
                                }
                                $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">
                                        
                                ';
                                foreach($k2->students as $k3){
                                    if($k2->time==="12:00 PM - 1:00 PM"){
                                        $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">Lunch break
                                        </td>';
                                    }
                                    if($k2->time!="12:00 PM - 1:00 PM"){
                                        $htmldoc.= ''. $k3->fname .''. $k3->lname.'<br></br>';
                                    }
                                    
                                }
                                $htmldoc.= ' </td>';
                                $htmldoc.= ' 
                                        <td width="" align="center" style="font-weight:;border:1px solid black">
                                        
                                ';
                                foreach($k2->panels as $k4){
                                    $htmldoc.= ''. $k4->fname .''. $k4->lname.'<br></br>';
                                }
                                $htmldoc.= ' </td>';
                                $htmldoc.= ' </tr>';
                                // $htmldoc.= '<hr style={{border:"1px solid gray",marginBottom:"10px",marginTop:"10px"}}></hr>';  
                        }
            }
            $htmldoc.= '</table></body></html>';
            $pdf =  Pdf::loadHTML($htmldoc)->setPaper('a4', 'landscape')->setWarnings(false);
            //return $pdf->stream('paymentReport'.'.pdf');
            return $pdf->stream('defense schedule'.'.pdf');
            // return $pdf->download('schedule.pdf');
    }
}




