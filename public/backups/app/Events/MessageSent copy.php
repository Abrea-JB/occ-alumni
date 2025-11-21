<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    public $id;
    public $title;
    public $user_id;
    public $message;
    public $time;
    public $className;

    public function __construct($data)
    {
        $this->id = $data['id'];
        $this->title = $data['title'] ?? 'New Notification';
        $this->user_id = $data['user_id'] ?? null;
        $this->message = $data['message'];
        $this->className = $data['className'];
        $this->time = $data['time'] ?? now()->toDateTimeString();
    }

    public function broadcastOn()
    {
        // Private channel for user ID 3 (or dynamic)
        return new Channel('public-user.' . $this->user_id);
        // For dynamic user channels:
        // return new Channel('public-user.'.$this->user_id);
    }

    public function broadcastAs()
    {
        return 'my-event';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'user_id' => $this->user_id,
            'message' => $this->message,
            'className' => $this->className,
            'time' => $this->time
        ];
    }
}
