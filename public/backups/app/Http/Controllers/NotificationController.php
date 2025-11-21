<?php

namespace App\Http\Controllers;

use App\Models\DeviceToken;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(Request $request)
    {
        $request->validate([
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:50',
        ]);

        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    public function count()
    {
        $count = Notification::where('user_id', Auth::id())
            ->where('read_at', null)
            ->count();

        return response()->json(['count' => $count]);
    }

    // public function count()
    // {
    //     return response()->json([
    //         'count' => Auth::user()->unreadNotifications->count()
    //     ]);
    // }

    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read'
        ]);
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('read', false)
            ->update([
                'read' => true,
                'read_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read'
        ]);
    }

    public function unreadCount()
    {
        $count = Notification::where('user_id', Auth::id())
            ->where('read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    public function destroy($id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->findOrFail($id);

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted successfully'
        ]);
    }

    // Register device token
    public function registerDevice(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'device_token' => 'required|string',
            'device_uuid' => 'required|string',
            'platform' => 'required|in:ios,android'
        ]);

        // Upsert the token (update if exists or create new)
        DeviceToken::updateOrCreate(
            ['token' => $validated['device_token']],
            [
                'user_id' => $validated['user_id'],
                'device_id' => $validated['device_uuid'],
                'platform' => $validated['platform']
            ]
        );

        return response()->json(['success' => true]);
    }

   
} 
