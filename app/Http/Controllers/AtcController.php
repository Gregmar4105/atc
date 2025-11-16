<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Flights;


class AtcController extends Controller
{
    /**
     * Update status for selected flights
     */
    public function updateFlightStatus(Request $request)
    {
        $request->validate([
            'flight_ids' => 'required|array',
            'status_id' => 'required|integer|in:1,2,3,4', // 1=Scheduled,2=Delayed,3=Re-route,4=Cleared
        ]);

        Flights::whereIn('id', $request->flight_ids)
            ->update(['status_id' => $request->status_id]);

        return response()->json([
            'success' => true,
            'message' => 'Flight status updated successfully'
        ]);
    }
}
