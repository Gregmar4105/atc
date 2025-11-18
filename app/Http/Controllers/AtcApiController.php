<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;

class AtcApiController extends Controller
{
    /**
     * Fetch weather from n8n webhook for a given city
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWeather(Request $request)
    {
        // Validate input
        $request->validate([
            'city' => 'required|string',
        ]);

        $city = $request->input('city');

        try {
            // Call the n8n webhook with a 15-second timeout
            $response = Http::timeout(15)->get('https://n8n.larable.dev/webhook/eb549b24-047c-4a02-a9b3-eeb33f8e7a11', [
                'city' => $city
            ]);

            // Check for failed response
            if ($response->failed()) {
                return response()->json([
                    'error' => 'Failed to fetch weather from n8n.'
                ], $response->status());
            }

            $data = $response->json();

            // Validate API response
            if (!$data || !isset($data['weather'])) {
                return response()->json([
                    'error' => 'City not found or invalid data returned.'
                ], 404);
            }

            // Return the JSON response to React
            return response()->json($data);

        } catch (RequestException $e) {
            return response()->json([
                'error' => 'Weather service timed out or unreachable. Please try again later.'
            ], 504);
        }
    }
}
