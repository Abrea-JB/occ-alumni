<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ClassworkSent implements ShouldBroadcast
{
    public $id;
    public $other_id;
    public $class_id;
    public $class_slug;
    public $title;
    public $message;
    public $time;
    public $className;
    public $type;

    public function __construct($data)
    {
        $this->id = $data['id'];
        $this->other_id = $data['other_id'] ?? null;
        $this->class_id = $data['class_id'];
        $this->class_slug = $data['class_slug'];
        $this->title = $data['title'] ?? 'New Notification';
        $this->message = $data['message'];
        $this->className = $data['className'];
        $this->time = $data['time'] ?? now()->toDateTimeString();
        $this->type = $data['type'];
    }

    public function broadcastOn()
    {
        return new Channel('classwork.' . $this->class_id);
    }

    public function broadcastAs()
    {
        return 'classwork';
    }

    public function broadcastWith()
    {

        return [
            'id' => $this->id,
            'other_id' => $this->other_id,
            'class_id' => $this->class_id,
            'class_slug' => $this->class_slug,
            'title' => $this->title,
            'message' => $this->message,
            'className' => $this->className,
            'time' => $this->time,
            'type' => $this->type
        ];
    }
}
