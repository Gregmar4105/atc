<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Airport;
use Illuminate\Support\Facades\DB;


class AirportStatusController extends Controller
{
    public function index()
    {
        DB::beginTransaction();

        try {
            // Get all airports
            $airports = Airport::all();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        // Return data to your React page
        return Inertia::render('AirportStatus/Index', [
            'airports' => $airports,
        ]);
    }
}
