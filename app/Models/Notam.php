<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notam extends Model
{
    protected $fillable = [
        'airport_id',
        'airport_name',
        'city',
        'message',
    ];

    /**
     * Relationship to Airport via iata_code
     */
    public function airport()
    {
        return $this->belongsTo(Airport::class, 'airport_id', 'iata_code');
    }
}
