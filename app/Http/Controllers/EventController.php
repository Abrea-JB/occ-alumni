<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Notification;
use App\Models\User;
use App\Http\Requests\StoreEventRequest;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{

    // Get events for dropdowns
    public function getEventData()
    {
        $eventTypes = [
            ['value' => 'conference', 'label' => 'Conference', 'color' => 'blue'],
            ['value' => 'workshop', 'label' => 'Workshop', 'color' => 'green'],
            ['value' => 'meetup', 'label' => 'Meetup', 'color' => 'orange'],
            ['value' => 'seminar', 'label' => 'Seminar', 'color' => 'purple'],
            ['value' => 'social', 'label' => 'Social', 'color' => 'pink'],
            ['value' => 'sports', 'label' => 'Sports', 'color' => 'red'],
            ['value' => 'other', 'label' => 'Other', 'color' => 'gray'],
        ];

        $eventCategories = [
            ['value' => 'technology', 'label' => 'Technology'],
            ['value' => 'business', 'label' => 'Business'],
            ['value' => 'arts', 'label' => 'Arts & Culture'],
            ['value' => 'education', 'label' => 'Education'],
            ['value' => 'health', 'label' => 'Health & Wellness'],
            ['value' => 'sports', 'label' => 'Sports & Fitness'],
            ['value' => 'music', 'label' => 'Music'],
            ['value' => 'food', 'label' => 'Food & Drink'],
            ['value' => 'networking', 'label' => 'Networking'],
        ];

        return response()->json([
            'eventTypes' => $eventTypes,
            'eventCategories' => $eventCategories,
        ]);
    }

    // Store new event
    public function store(StoreEventRequest $request)
    {
        try {
            $imagePaths = [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('events/images', 'public');
                    $imagePaths[] = $path;
                }
            }

            $currentDateTime = now();
            $eventDate = $request->date;
            $startTime = $request->start_time ?? ($request->input('timeRange.0') ?? null);
            $endTime = $request->end_time ?? ($request->input('timeRange.1') ?? null);

            $eventDateTime = \Carbon\Carbon::parse($eventDate . ' ' . $startTime);
            $eventEndDateTime = \Carbon\Carbon::parse($eventDate . ' ' . $endTime);

            $status = 'upcoming';
            if ($currentDateTime->greaterThan($eventEndDateTime)) {
                $status = 'completed';
            } elseif ($currentDateTime->between($eventDateTime, $eventEndDateTime)) {
                $status = 'ongoing';
            }

            $event = Event::create([
                'title' => $request->title,
                'description' => $request->description,
                'event_type' => $request->event_type,
                'category' => $request->category,
                'date' => $request->date,
                'start_time' => $request->start_time ?? ($request->timeRange[0] ?? null),
                'end_time' => $request->end_time ?? ($request->timeRange[1] ?? null),
                'location' => $request->location,
                'price' => $request->price ?? 0,
                'capacity' => $request->capacity,
                'organizer' => $request->organizer,
                'tags' => $request->tags,
                'agenda' => $request->agenda,
                'featured' => (int) $request->featured,
                'images' => $imagePaths,
                'user_id' => auth()->id(),
                'status' => $status,
            ]);

            $alumniUsers = User::where('role', 'alumni')->get();
            
            // Get full image URLs for notification
            $eventImageUrls = [];
            if (!empty($imagePaths)) {
                foreach ($imagePaths as $path) {
                    $eventImageUrls[] = asset('storage/' . $path);
                }
            }
            
            foreach ($alumniUsers as $alumnus) {
                Notification::create([
                    'user_id' => $alumnus->id,
                    'notifiable_type' => 'new_event',
                    'data' => json_encode([
                        'title' => 'New Event Created',
                        'message' => 'A new event has been created: ' . $event->title,
                        'event_id' => $event->id,
                        'event_title' => $event->title,
                        'event_type' => $event->event_type,
                        'event_date' => $event->date,
                        'event_location' => $event->location,
                        'event_description' => substr($event->description, 0, 150),
                        'event_images' => $eventImageUrls, // Added event images to notification
                        'created_by' => auth()->user()->name ?? 'Admin',
                        'created_at' => now()->toIso8601String(),
                    ]),
                    'read' => false,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Event created successfully!',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get all events
    public function index(Request $request)
    {
        $alumniId = auth()->id(); // ← ADDED

        // $query = Event::with('user')->upcoming();
        $query = Event::with('user');

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('event_type', $request->type);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $events = $query->orderBy('date')->get();

        // INSERTED FEATURES
        $events = $events->map(function ($event) use ($alumniId) {
            $event->registered_count = EventRegistration::where('event_id', $event->id)->count();

            $event->is_user_registered = EventRegistration::where('event_id', $event->id)
                ->where('alumni_id', $alumniId)
                ->exists();

            return $event;
        });

        return response()->json($events);
    }

  // Get single event
    public function show(Event $event)
    {
        $alumni = \App\Models\Alumni::where('user_id', auth()->id())->first();
        $alumniId = $alumni ? $alumni->id : null;

        $event->load('user');
        
        $event->registered_count = EventRegistration::where('event_id', $event->id)->count();
        
        $event->is_user_registered = $alumniId ? EventRegistration::where('event_id', $event->id)
            ->where('alumni_id', $alumniId)
            ->exists() : false;

        return response()->json($event);
    }


    public function update(Request $request, Event $event)
    {
        try {
            $imagePaths = $event->images ?? [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('events/images', 'public');
                    $imagePaths[] = $path;
                }
            }

            $currentDateTime = now();
            $eventDate = $request->date;
            $startTime = $request->start_time ?? ($request->input('timeRange.0') ?? null);
            $endTime = $request->end_time ?? ($request->input('timeRange.1') ?? null);

            $eventDateTime = \Carbon\Carbon::parse($eventDate . ' ' . $startTime);
            $eventEndDateTime = \Carbon\Carbon::parse($eventDate . ' ' . $endTime);

            $status = 'upcoming';
            if ($currentDateTime->greaterThan($eventEndDateTime)) {
                $status = 'completed';
            } elseif ($currentDateTime->between($eventDateTime, $eventEndDateTime)) {
                $status = 'ongoing';
            }

            $event->update([
                'title' => $request->title,
                'description' => $request->description,
                'event_type' => $request->event_type,
                'category' => $request->category,
                'date' => $eventDate,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'location' => $request->location,
                'price' => $request->price ?? 0,
                'capacity' => $request->capacity,
                'organizer' => $request->organizer,
                'tags' => $request->tags,
                'agenda' => $request->agenda,
                'featured' => (int) $request->featured,
                'images' => $imagePaths,
                'status' => $status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Event updated successfully!',
                'data' => $event->fresh('user')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update event: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | INSERTED: EVENT REGISTRATION FUNCTIONS
    |--------------------------------------------------------------------------
    */

    // REGISTER
    public function register(Request $request, Event $event)
    {
        // Find the corresponding alumni record for the authenticated user
        $alumni = \App\Models\Alumni::where('user_id', auth()->id())->first();

        if (!$alumni) {
            return response()->json([
                'success' => false,
                'message' => 'Alumni record not found for this user.'
            ], 404);
        }

        $alumniId = $alumni->id;

        // Already registered?
        if (
            EventRegistration::where('event_id', $event->id)
            ->where('alumni_id', $alumniId)
            ->exists()
        ) {
            return response()->json([
                'success' => false,
                'message' => 'You are already registered for this event.'
            ], 400);
        }

        // Capacity check
        if (
            EventRegistration::where('event_id', $event->id)->count()
            >= $event->capacity
        ) {
            return response()->json([
                'success' => false,
                'message' => 'This event is already fully booked.'
            ], 400);
        }

        EventRegistration::create([
            'event_id' => $event->id,
            'alumni_id' => $alumniId,
        ]);

        $alumniProfileImage = null;
        if ($alumni->profile_image) {
            $alumniProfileImage = asset('storage/' . $alumni->profile_image);
        } elseif ($alumni->profile_image_url) {
            $alumniProfileImage = $alumni->profile_image_url;
        }

        $adminUsers = User::where('role', 'admin')->get();
        foreach ($adminUsers as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'notifiable_type' => 'event_registration',
                'data' => json_encode([
                    'title' => 'Event Registration',
                    'message' => ($alumni->first_name . ' ' . $alumni->last_name) . ' has registered for: ' . $event->title,
                    'event_id' => $event->id,
                    'event_title' => $event->title,
                    'alumni_id' => $alumni->id,
                    'alumni_name' => $alumni->first_name . ' ' . $alumni->last_name,
                    'alumni_profile_image' => $alumniProfileImage,
                ]),
                'read' => false,
            ]);
        }

        Notification::create([
            'user_id' => auth()->id(),
            'notifiable_type' => 'event_registration_success',
            'data' => json_encode([
                'title' => 'Event Registration Successful',
                'message' => 'You have successfully registered for the event.',
                'event_id' => $event->id,
                'event_title' => $event->title,
                'event_date' => $event->date,
                'event_location' => $event->location,
            ]),
            'read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Successfully registered!'
        ]);
    }


    // CANCEL
    public function cancelRegistration(Request $request, Event $event)
    {
        // Get the corresponding alumni record for the logged-in user
        $alumni = \App\Models\Alumni::where('user_id', auth()->id())->first();

        if (!$alumni) {
            return response()->json([
                'success' => false,
                'message' => 'Alumni record not found.'
            ], 404);
        }

        $alumniId = $alumni->id;

        $registration = EventRegistration::where('event_id', $event->id)
            ->where('alumni_id', $alumniId)
            ->first();

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'You are not registered for this event.'
            ], 404);
        }

        $registration->delete();

        return response()->json([
            'success' => true,
            'message' => 'Registration cancelled successfully.'
        ]);
    }


    // LIST OF REGISTERED USERS (ADMIN)
    public function registrations(Event $event)
    {
        try {
            // Fetch all registrations with the related user/alumni info
            $registrations = EventRegistration::with('alumni')
                ->where('event_id', $event->id)
                ->get()
                ->map(function ($registration) {
                    return [
                        'id' => $registration->id,
                        'event_id' => $registration->event_id,
                        'alumni_id' => $registration->alumni_id,
                        'status' => $registration->status,
                        'registration_date' => $registration->registration_date,
                        'alumni' => $registration->alumni ? [
                            'name' => trim(
                                $registration->alumni->first_name . ' ' .
                                ($registration->alumni->middle_name ?? '') . ' ' .
                                $registration->alumni->last_name . ' ' .
                                ($registration->alumni->suffix ?? '')
                            ),
                            'email' => $registration->alumni->email ?? null,
                            'contact_number' => $registration->alumni->phone ?? null,
                            'batch_year' => $registration->alumni->graduation_year ?? null,
                            // 'course' => $registration->alumni->course ?? null,
                        ] : null,
                    ];
                });

            return response()->json([
                'success' => true,
                'event' => $event,
                'data' => $registrations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch registrations: ' . $e->getMessage()
            ], 500);
        }
    }


}
