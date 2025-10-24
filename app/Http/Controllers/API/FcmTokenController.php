<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FcmToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class FcmTokenController extends Controller
{
    /**
     * Store or update FCM token
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'device_id' => 'nullable|string|max:255',
            'device_model' => 'nullable|string|max:255',
            'device_platform' => 'nullable|string|max:255',
            'device_os_version' => 'nullable|string|max:255',
            'app_version' => 'nullable|string|max:255',
            'app_build_number' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            $data['user_id'] = $request->user()->id;
            $data['ip_address'] = $request->ip();
            $data['last_used_at'] = now();

            // Update or create token record
            $token = FcmToken::updateOrCreate(
                ['token' => $data['token']],
                $data
            );

            // Deactivate other tokens for the same device
            if (!empty($data['device_id'])) {
                FcmToken::where('device_id', $data['device_id'])
                    ->where('token', '!=', $data['token'])
                    ->update(['is_active' => false]);
            }

            return response()->json([
                'success' => true,
                'message' => 'FCM token stored successfully',
                'token' => $token
            ]);

        } catch (\Exception $e) {
            Log::error('FCM token storage failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to store FCM token'
            ], 500);
        }
    }

    /**
     * Remove FCM token
     */
    public function destroy(Request $request, $token)
    {
        try {
            $deleted = FcmToken::where('token', $token)
                ->where('user_id', $request->user()->id)
                ->delete();

            if ($deleted) {
                return response()->json([
                    'success' => true,
                    'message' => 'FCM token removed successfully'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'FCM token not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('FCM token deletion failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove FCM token'
            ], 500);
        }
    }

    /**
     * Get user's active FCM tokens
     */
    public function index(Request $request)
    {
        $tokens = FcmToken::forUser($request->user()->id)
            ->active()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tokens
        ]);
    }
}