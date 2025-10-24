<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Presentation;

class PresentationController extends Controller
{
    public function index($class_id)
    {
        $id = getClassId($class_id);
        $presentations = Presentation::with(['classroom', 'topic'])->where('class_id', $id)
            // ->when(request()->has('class_id'), function ($query, $id) {
            //     $query->where('class_id', $id);
            // })
            // ->when(request()->has('topic_id'), function ($query) {
            //     $query->where('topic_id', request('topic_id'));
            // })
            ->when(request()->has('status'), function ($query) {
                $query->where('status', request('status'));
            })
            ->latest()
            ->get();

        return response()->json($presentations);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $class_id = getClassId($request->class_id);
        $validated = $request->validate([
            // 'topic_id' => 'nullable|exists:classwork_topics,id',
            'title' => 'required|string|max:255',
            'url' => 'required|url',
            'status' => 'nullable|in:visible,invisible',
        ]);

        $presentation = Presentation::create([
            'class_id' => $class_id,
            'topic_id' => $validated['topic_id'] ?? null,
            'title' => $validated['title'],
            'link' => $validated['url'],
            'status' => $validated['status'] ?? 'visible',
        ]);

        //return response()->json($presentation->load(['classroom', 'topic']), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Presentation  $presentation
     * @return \Illuminate\Http\Response
     */
    public function show(Presentation $presentation)
    {
        return response()->json($presentation->load(['classroom', 'topic']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Presentation  $presentation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Presentation $presentation)
    {
        $validated = $request->validate([
            'class_id' => 'sometimes|exists:classroom,id',
            'topic_id' => 'nullable|exists:classwork_topics,id',
            'title' => 'sometimes|string|max:255',
            'link' => 'sometimes|url',
            'status' => 'sometimes|in:visible,invisible',
        ]);

        $presentation->update($validated);

        return response()->json($presentation->fresh()->load(['classroom', 'topic']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Presentation  $presentation
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $presentation = Presentation::findOrFail($request->id);
        $presentation->delete();
    }

    /**
     * Toggle presentation status between visible and invisible
     *
     * @param  \App\Models\Presentation  $presentation
     * @return \Illuminate\Http\Response
     */
    public function toggleStatus(Presentation $presentation)
    {
        $presentation->update([
            'status' => $presentation->status === 'visible' ? 'invisible' : 'visible'
        ]);

        return response()->json(['message' => 'Status updated successfully', 'status' => $presentation->status]);
    }
}
