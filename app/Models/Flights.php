<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flights extends Model
{
    // If your table name follows Laravel conventions (plural lowercase, e.g., "flights"), this is optional
    protected $table = 'flights';

    // If your primary key is not "id", specify it here
    protected $primaryKey = 'id';

    // If you want to allow mass assignment
    protected $fillable = [
        'flight_number',
        'airline_code',
        'origin_code',
        'destination_code',
        'aircraft_icao_code',
        'scheduled_departure_time',
        'scheduled_arrival_time',
        'status_id',
    ];

    // Optional: if you want timestamps (created_at, updated_at)
    public $timestamps = true;
}
