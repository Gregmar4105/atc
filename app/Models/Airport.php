<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    protected $table = 'airports'; // database table name
    protected $primaryKey = 'iata_code';
    public $incrementing = false; // because iata_code is a string
    protected $keyType = 'string';
    protected $fillable = [
        'iata_code',
        'airport_name',
        'city',
        'country',
        'airport_status',
        'timezone',
    ];

    public $timestamps = false; 
}
