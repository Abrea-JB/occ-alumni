<?php


namespace App\Http\Controllers;

use App\Models\Event;
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
            
            // Handle image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('events/images', 'public');
                    $imagePaths[] = $path;
                }
            }
            
            // Create event
            $event = Event::create([
                'title' => $request->title,
                'description' => $request->description,
                'event_type' => $request->event_type,
                'category' => $request->category,
                'date' => $request->date,
                'start_time' => $request->timeRange[0],
                'end_time' => $request->timeRange[1],
                'location' => $request->location,
                'price' => $request->price ?? 0,
                'capacity' => $request->capacity,
                'organizer' => $request->organizer,
                'tags' => $request->tags,
                'agenda' => $request->agenda,
                'featured' => $request->featured ?? false,
                'images' => $imagePaths,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Event created successfully!',
                'data' => $event->load('user')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update event
    public function update(StoreEventRequest $request, Event $event)
    {
        try {
            $imagePaths = $event->images ?? [];
            
            // Handle new image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('events/images', 'public');
                    $imagePaths[] = $path;
                }
            }
            
            // Update event
            $event->update([
                'title' => $request->title,
                'description' => $request->description,
                'event_type' => $request->event_type,
                'category' => $request->category,
                'date' => $request->date,
                'start_time' => $request->timeRange[0],
                'end_time' => $request->timeRange[1],
                'location' => $request->location,
                'price' => $request->price ?? 0,
                'capacity' => $request->capacity,
                'organizer' => $request->organizer,
                'tags' => $request->tags,
                'agenda' => $request->agenda,
                'featured' => $request->featured ?? false,
                'images' => $imagePaths,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Event updated successfully!',
                'data' => $event->load('user')
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update event: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete event
    public function destroy(Event $event)
    {
        try {
            // Delete associated images from storage
            if ($event->images && is_array($event->images)) {
                foreach ($event->images as $imagePath) {
                    Storage::disk('public')->delete($imagePath);
                }
            }

            $event->delete();

            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete event: ' . $e->getMessage()
            ], 500);
        }
    }

    // Duplicate event
    public function duplicate(Event $event)
    {
        try {
            $newEvent = $event->replicate();
            $newEvent->title = $event->title . ' (Copy)';
            $newEvent->featured = false;
            $newEvent->user_id = auth()->id();
            $newEvent->save();

            return response()->json([
                'success' => true,
                'message' => 'Event duplicated successfully!',
                'data' => $newEvent->load('user')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to duplicate event: ' . $e->getMessage()
            ], 500);
        }
    }

    // Register for event
    public function register(Request $request, Event $event)
    {
        try {
            $validated = $request->validate([
                'fullName' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'graduationYear' => 'nullable|integer|min:1950|max:' . (date('Y') + 10),
                'dietaryRequirements' => 'nullable|string',
                'specialRequests' => 'nullable|string',
            ]);

            // Check if event is full
            if ($event->registered >= $event->capacity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event is fully booked'
                ], 400);
            }

            // Here you would typically create a registration record in a registrations table
            // For now, we'll just increment the registered count
            $event->increment('registered');

            // You can send confirmation email here
            // Mail::to($validated['email'])->send(new EventRegistrationConfirmation($event, $validated));

            return response()->json([
                'success' => true,
                'message' => 'Successfully registered for the event!',
                'data' => [
                    'event' => $event->load('user'),
                    'registration' => $validated
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to register: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get all events (for listing)
    public function index(Request $request)
    {
        
        $query = Event::with('user')->upcoming();

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('event_type', $request->type);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $events = $query->orderBy('date')->get();

        return response()->json($events);
    }

    // Get single event
    public function show(Event $event)
    {
        return response()->json($event->load('user'));
    }
}
