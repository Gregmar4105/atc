<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FlightStatus;

class FlightStatusController extends Controller
{
    public function index()
    {
        // Fetch all flight statuses
        $flightStatuses = FlightStatus::all();

        return Inertia::render('FlightStatus/Index', [
            'flightStatuses' => $flightStatuses, // send as 'statuses', not 'flights'
        ]);
    }
}
