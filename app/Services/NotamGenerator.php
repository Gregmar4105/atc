<?php

namespace App\Services;

class NotamGenerator
{
    public static function generate($city, $iata, $weatherDescription, $windSpeed)
    {
        $notamNumber = rand(1000, 9999);

        $start = now()->format('ymdHi') . "Z";
        $end = now()->addDays(3)->format('ymdHi') . "Z";

        $delayLine = "";

        // Include delay line ONLY when storm / thunder / heavy wind
        if (
            stripos($weatherDescription, 'storm') !== false ||
            stripos($weatherDescription, 'thunder') !== false ||
            ($windSpeed > 10)
        ) {
            $delayLine = "E) EXPECT DELAY AND OPERATIONAL LIMITATIONS.\n";
            $weatherAdvice = "F) Severe weather: " . ucfirst($weatherDescription) . " (Wind: {$windSpeed} knots).";
        } else {
            // Include a standard weather description line when clear
            $weatherAdvice = "E) Current weather: " . ucfirst($weatherDescription) . " (Wind: {$windSpeed} knots).";
        }

        return
            "NOTAM {$notamNumber}/" . now()->year . "\n" .
            "A) {$iata}\n" .
            "B) {$start}\n" .
            "C) {$end}\n" .
            $delayLine .
            $weatherAdvice;
    }
}