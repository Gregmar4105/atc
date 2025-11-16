<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Flights;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FlightStatusController extends Controller
{
    /**
     * Show the flights dashboard.
     */
    public function index()
    {
        $flights = Flights::all()->map(function ($flight) {
            $statusText = match ($flight->status_id) {
                2 => 'Delayed',
                3 => 'Re-route',
                4 => 'Clear for Landing',
                default => 'Scheduled',
            };

            return [
                'id' => $flight->id,
                'flight_number' => $flight->flight_number,
                'airline_code' => $flight->airline_code,
                'origin_code' => $flight->origin_code,
                'destination_code' => $flight->destination_code,
                'aircraft_icao_code' => $flight->aircraft_icao_code,
                'scheduled_departure_time' => $flight->scheduled_departure_time,
                'scheduled_arrival_time' => $flight->scheduled_arrival_time,
                'status_id' => $flight->status_id,
                'status_text' => $statusText,
            ];
        });

        return Inertia::render('FlightStatus/Index', [
            'flights' => $flights,
        ]);
    }

    /**
     * Update status of selected flights + create announcements.
     */
    public function updateStatus(Request $request)
{
    Log::info('UpdateStatus Request:', $request->all());

    $request->validate([
        'flight_ids' => 'required|array',
        'flight_ids.*' => 'required|integer|exists:flights,id',
        'status_id' => 'required|integer|in:1,2,3,4', // 1 = Scheduled
    ]);

    try {
        $statusId = $request->status_id;
        $flightIds = $request->flight_ids;

        // Map status_id to text
        $statusText = match ($statusId) {
            1 => 'Scheduled',
            2 => 'Delayed',
            3 => 'Re-route',
            4 => 'Clear for Landing',
        };

        // Update flights table
        $updatedCount = Flights::whereIn('id', $flightIds)
            ->update(['status_id' => $statusId]);

        // Update announcements
        $flightsToAnnounce = Flights::select('id', 'flight_number', 'origin_code', 'destination_code')
            ->whereIn('id', $flightIds)
            ->get();

        foreach ($flightsToAnnounce as $flight) {
            DB::table('flight_announcements')->updateOrInsert(
                ['flight_id' => $flight->id],
                [
                    'flight_number' => $flight->flight_number,
                    'origin_code' => $flight->origin_code,
                    'destination_code' => $flight->destination_code,
                    'status_id' => $statusId,
                    'status_text' => $statusText,
                    'updated_at' => now(),
                    'created_at' => DB::raw('COALESCE(created_at, NOW())'),
                ]
            );
        }

        return redirect()->route('FlightStatus.index')
            ->with('success', "Updated status for {$updatedCount} flight(s).");

    } catch (\Exception $e) {
        Log::error('Flight status update failed: ' . $e->getMessage());
        return redirect()->back()->with('error', 'Failed to update flight status.');
    }
}
}
