<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Airport;


class AirportStatusController extends Controller
{
    public function index()
    {
        // Get all airports
        $airports = Airport::all();

        // Return data to your React page
        return Inertia::render('AirportStatus/Index', [
            'airports' => $airports,
        ]);
    }
}
