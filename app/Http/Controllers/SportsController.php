<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Users;
use App\Models\SportsList;
use App\Models\Coaches;
use App\Models\CoachSports;
use App\Models\CoachBookings;
use App\Models\PlayerBookings;
use App\Models\CoachRatings;
use App\Models\User;
use DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;



class SportsController extends Controller
{

    public function registerUser(Request $request)
    {
        DB::beginTransaction();
        try {
            $fname = $request->fname;
            $lname = $request->lname;
            $user = Users::create([
                "name" => $fname . ' ' . $lname,
                "email" => $request->email,
                "lname" => $request->lastName,
                "fname" => $request->firstName,
                "role" => $request->userType,
                "password" => bcrypt($request->password),
            ]);
            if ($request->userType === 'coach') {

                $valid_id  = '';
                $specializations = json_decode($request->specialization, true);
                if ($request->hasFile('idDocument')) {
                    $idDocument = $request->idDocument;
                    $extension = $idDocument->getClientOriginalExtension();
                    $valid_id = 'id-' . time() . '-' . Str::random(10) . '.' . $extension;
                    $uploadPath = public_path("uploads/coach/id-verification");
                    if (!File::isDirectory($uploadPath)) {
                        File::makeDirectory($uploadPath, 0755, true, true);
                    }
                    //$idDocument->move($uploadPath, $valid_id);
                }
                $coach = Coaches::create([
                    'user_id' => $user->id,
                    'valid_id' => "uploads/coach/id-verification/{$valid_id}",
                    "detailed_bio" => $request->bio,
                    "specialization" => "",
                    "briefDescription" => $request->brief_description,
                    "years_experience" => $request->experience,
                    "awards" => $request->awards,
                ]);

                foreach ($specializations as $specializationId) {
                    CoachSports::create([
                        'coach_id'  => $coach->id,
                        'sports_id' => $specializationId,
                    ]);
                }
            }
            DB::commit();
            return response()->json(['success' => true, 'message' => "created"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function   getSports()
    {
        $list = SportsList::orderBy("name", 'asc')->get();
        return response()->json($list, 200);
    }



    public function getCoaches()
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // if ($user->role === 'admin') {
        //     $list = Coaches::with('user')
        //         ->withAvg('ratings', 'rating')
        //         ->withCount('ratings')
        //         ->withCount([
        //             'ratings as clients_count' => function ($q) {
        //                 $q->select(DB::raw('COUNT(DISTINCT user_id)'));
        //             }
        //         ])
        //         ->latest()
        //         ->get();
        // } else {
        //     $list = Coaches::with('user')
        //         ->where('status', 'approved')
        //         ->withAvg('ratings', 'rating')
        //         ->withCount('ratings')
        //         ->withCount([
        //             'ratings as clients_count' => function ($q) {
        //                 $q->select(DB::raw('COUNT(DISTINCT user_id)'));
        //             }
        //         ])
        //         ->latest()
        //         ->get();
        // }

        $list = Coaches::with('user')
            ->withAvg('ratings', 'rating')
            ->withCount('ratings')
            ->withCount([
                'ratings as clients_count' => function ($q) {
                    $q->select(DB::raw('COUNT(DISTINCT user_id)'));
                }
            ])
            ->latest()
            ->get();

        // Format the output
        $list->map(function ($coach) {
            $coach->average_rating = round($coach->ratings_avg_rating ?? 0, 1);
            $coach->total_reviews  = $coach->ratings_count;
            $coach->clients        = $coach->clients_count;

            unset($coach->ratings_avg_rating, $coach->ratings_count, $coach->clients_count);
            return $coach;
        });

        return response()->json($list, 200);
    }



    public function storeSports(Request $request)
    {
        DB::beginTransaction();
        try {
            $id = $request->id;
            $name = $request->name;
            $sport = SportsList::updateOrCreate(
                ['id' => $id],
                ['name' => $name]
            );
            $action = $sport->wasRecentlyCreated ? 'created' : 'updated';
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => $action,
                'data' => $action
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function createPayment(Request $request)
    {
        // Get parameters from request
        $price = $request->input('price', 100); // default: 100 PHP
        $name = $request->input('name', 'Sample Product');
        $coach = $request->input('coach', 'Unknown Coach');
        $bookingId = $request->input('booking_id', null);

        // Convert price into centavos (PayMongo requires centavos)
        $amountInCentavos = $price * 100;

        $response = Http::withHeaders([
            'Authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY') . ':'),
            'Content-Type'  => 'application/json',
        ])->post('https://api.paymongo.com/v1/checkout_sessions', [
            'data' => [
                'attributes' => [
                    'line_items' => [
                        [
                            'currency' => 'PHP',
                            'amount' => $amountInCentavos,
                            'name' => $name,
                            'quantity' => 1,
                        ]
                    ],
                    'payment_method_types' => ['card', 'gcash'],
                    'redirect' => [
                        'success' => url('/api/payment/success'),
                        'failed'  => url('/api/payment/failed'),
                    ],
                    'description' => "Booking payment for {$name} with {$coach}",
                    'metadata' => [
                        'order_id'   => uniqid('order_'),
                        'booking_id' => $bookingId,
                        'coach'      => $coach,
                        'price'      => $price,
                    ],
                ],
            ],
        ]);

        return response()->json($response->json());
    }


    public function success()
    {
        return 'Payment Success! You can now update order status.';
    }

    public function failed()
    {
        return 'Payment Failed! Please retry.';
    }

    public function storeCoachBooking(Request $request)
    {
        // return $request->all();
        DB::beginTransaction();
        try {
            $user = auth('api')->user();
            $coach = Coaches::where('user_id', $user->id)->firstOrFail();
            $image  = '';
            $specializations = json_decode($request->specialization, true);
            if ($request->hasFile('image')) {
                $idDocument = $request->image;
                $extension = $idDocument->getClientOriginalExtension();
                $image = 'id-' . time() . '-' . Str::random(10) . '.' . $extension;
                $uploadPath = public_path("uploads/booking");
                if (!File::isDirectory($uploadPath)) {
                    File::makeDirectory($uploadPath, 0755, true, true);
                }
                $idDocument->move($uploadPath, $image);
            }
            $coach = CoachBookings::create([
                'coach_id' => $coach->id,
                'banner' => "uploads/booking/{$image}",
                "description" => $request->description,
                "booking_title" => $request->title,
                "start_date" => $request->startDate,
                "end_date" => $request->endDate,
                "start_time" => $request->startTime,
                "end_time" => $request->endTime,
                "price" => $request->price,
                "vacant" => $request->vacancies,
                "localtion" => $request->location,
                "contact" => $request->contactInfo,
                "sports_id" => $request->sports_id,
            ]);


            DB::commit();
            return response()->json(['success' => true, 'message' => "created"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getBookings(Request $request)
    {
        $user = auth('api')->user();
        $bookings = CoachBookings::with(['ratings', 'sports', 'coach.user', 'players.user'])->latest()->get();

        $bookings = $bookings->map(function ($booking) use ($user) {
            $booking->isBooked = $booking->players->contains('user_id', $user->id);

            $booking->isRated = $booking->ratings->contains('user_id', $user->id);

            return $booking;
        });

        return response()->json($bookings, 200);
    }

    public function updateCoachStatus(Request $request)
    {
        $request->validate([
            'coach_id' => 'required|integer|exists:coaches,id',
            'status' => 'required|string'
        ]);

        $coach = Coaches::where('id', $request->coach_id)->first();

        if ($coach) {
            $coach->status = $request->status;
            $coach->reason_declined = $request->reason_declined ?? '';
            $coach->save();
            return response()->json(['message' => 'Coach status updated successfully']);
        }

        return response()->json(['message' => 'Coach not found'], 404);
    }

    public function bookedSports(Request $request)
    {
        // return $request->all();


        DB::beginTransaction();
        try {

            $user = auth('api')->user();
            $coach = PlayerBookings::create([
                'user_id' => $user->id,
                "coach_booking_id" => $request->coach_booking_id,
                "amount" => $request->amount,
            ]);


            DB::commit();
            return response()->json(['success' => true, 'message' => "created"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getPlayers(Request $request)
    {
        $bookings  =  User::with(['bookingHistory'])->whereRole('player')->latest()->get();
        return response()->json($bookings, 200);
    }

    public function releasePayment(Request $request)
    {

        foreach ($request->booking_id as $bookingId) {
            CoachBookings::where('id', $bookingId)
                ->update(['status' => 'released']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payments released successfully.'
        ]);
    }

    public function profile()
    {
        $user = auth('api')->user();
        $profile = Users::where('id', $user->id)->first();
        // if ($user->role === "student") {
        //     $profile = Students::where('students.user_id', $user_id->id)
        //         ->first();
        // }

        return response()->json(['result' => true, 'profile' =>  $profile, 'skills' =>  [], 'skills_array' =>  [], 'user' =>  $user], 200);
    }

    public function updateProfileMobile(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
        ]);
        $user = auth('api')->user();
        User::where('id', $user->id)
            ->update([
                'fname' => $request->fname,
                'lname' => $request->lname,
            ]);
        $imagePath = public_path('uploads/profile/' . $user->image);
        if (File::exists($imagePath)) {
            File::delete($imagePath);
        }


        $user_check = Users::where('id', $user->id)->first();
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $fileName =  "profile-" . rand() . time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/profile'), $fileName);
            $user = new Users();
            $user->exists = true;
            $user->id = $user_check->id;
            $user->image = $fileName;
            if (!empty($request->newPassword)) {
                $user->password = bcrypt($request->newPassword);
            }
            $user->save();
        }
    }


    public function rateSession(Request $request)
    {
        DB::beginTransaction();
        $user = auth('api')->user();
        try {
            CoachRatings::create([
                'user_id' => $user->id,
                "coach_booking_id" => $request->coach_booking_id,
                "comments" => $request->comments,
                "rating" => $request->rating,
            ]);
            DB::commit();
            return response()->json(['success' => true, 'message' => "created"], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getRatings(Request $request)
    {
        $user = auth('api')->user();
        $ratings =   CoachRatings::with(['user'])->whereCoachBookingId($request->id)->latest()->get();
        return response()->json($ratings, 200);
    }

    public function updateBookingStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'status' => 'required|string'
        ]);

        $coach = CoachBookings::where('id', $request->id)->first();

        if ($coach) {
            $coach->status = $request->status;
            $coach->save();
            return response()->json(['message' => 'Coach status updated successfully']);
        }

        return response()->json(['message' => 'Coach not found'], 404);
    }

    public function logout(Request $request)
    {
        //$request->user()->token()->revoke();
        return response()->json([
            'message' => 'Logged out successfully.'
        ]);
    }
}
