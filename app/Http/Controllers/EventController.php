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
                'start_time' => $request->start_time ?? ($request->timeRange[0] ?? null),
                'end_time' => $request->end_time ?? ($request->timeRange[1] ?? null),
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
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event: ' . $e->getMessage()
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

    public function update(Request $request, Event $event)
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

            // Update event
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
                'featured' => $request->featured ?? false,
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
}
