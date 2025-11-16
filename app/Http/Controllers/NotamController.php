<?php

namespace App\Http\Controllers;

use App\Models\Notam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Services\NotamGenerator;
use Illuminate\Support\Facades\Log;

class NotamController extends Controller
{
    // Show all NOTAMs
    public function index()
    {
        return Inertia::render('Notams/Index', [
            'notams' => Notam::with('airport')->latest()->get(),
        ]);
    }

    // Edit NOTAM
    public function edit(Request $request)
    {
        $notamId = $request->query('id');
        if (!$notamId) {
            return redirect()->route('notams.index')->with('error', 'NOTAM ID is required.');
        }

        $notam = Notam::findOrFail($notamId);

        return Inertia::render('Notams/Edit', [
            'notam' => $notam,
        ]);
    }

    // Update NOTAM
    public function update(Request $request, Notam $notam)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $notam->update([
            'message' => $request->message,
        ]);

        try {
            Http::post('https://n8n.larable.dev/webhook/78988c9e-532f-43ea-82f0-cca56a6f5a69', [
                'notam_id' => $notam->id,
                'airport_id' => $notam->airport_id,
                'city' => $notam->city,
                'message' => $notam->message,
                'updated_at' => now()->toISOString(),
                'query' => 'update',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to trigger n8n webhook for NOTAM update: ' . $e->getMessage());
        }

        return redirect()->route('notams.index')->with('success', 'NOTAM updated successfully.');
    }
    //delete
    public function destroy(Notam $notam)
    {
        try {
            $notamData = [
                'airport_id' => $notam->airport_id,
                'city'       => $notam->city,
                'message'    => $notam->message,
                'query'    => 'delete',
            ];

            // Delete the NOTAM locally
            $notam->delete();

            // Call the n8n webhook to notify deletion
            try {
                Http::post('https://n8n.larable.dev/webhook/a8ec4401-c4d5-4bc9-9db4-971c2fd682f3', $notamData);
            } catch (\Exception $e) {
                Log::error('Failed to call n8n webhook on NOTAM delete: ' . $e->getMessage());
            }

            return redirect()->route('notams.index')
                ->with('success', 'NOTAM deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('notams.index')
                ->with('error', 'Failed to delete NOTAM: ' . $e->getMessage());
        }
    }


    // Generate batch NOTAMs (existing code)
    public function generateBatch(Request $request)
    {
        $airports  = array_slice($request->input('airports', []), 0, 10);
        $n8nWebhookUrl = 'https://n8n.larable.dev/webhook/c6b2403b-be4b-413d-82d1-db42fa2ff860';

        $generated = 0;
        $failed = 0;
        $errors = [];

        foreach ($airports as $airport) {
            $cityQuery = $airport['city'];
            if (!empty($airport['country_code'])) $cityQuery .= ',' . $airport['country_code'];

            $response = Http::get($n8nWebhookUrl, [
                'city'  => $cityQuery,
                'units' => 'metric',
            ]);

            if ($response->failed()) {
                $failed++;
                $errors[] = "{$airport['iata_code']} – Webhook failed";
                continue;
            }

            $weatherData = $response->json();

            if (!is_array($weatherData) || empty($weatherData['weather'][0]['description'] ?? null)) {
                $failed++;
                $errors[] = "{$airport['iata_code']} – Invalid weather data";
                continue;
            }

            $weatherDesc = strtolower($weatherData['weather'][0]['description'] ?? 'unknown');
            $windSpeed   = $weatherData['wind']['speed'] ?? 0;

            $advice = (str_contains($weatherDesc, 'storm') || $windSpeed > 10)
                ? "NOT ADVISED to take flight due to severe weather conditions."
                : "Safe to take flight. Weather conditions are stable.";

            $notamContent = NotamGenerator::generate(
                $airport['city'],
                $airport['iata_code'],
                $weatherDesc,
                $windSpeed
            );

            $message = $notamContent . "\n" .
                "F) Weather Report: {$weatherData['weather'][0]['description']}. " .
                "Wind: {$windSpeed} m/s. {$advice}\n";

            $existing = Notam::where('airport_id', $airport['iata_code'])
                ->where('message', $message)
                ->first();

            if ($existing) {
                $errors[] = "{$airport['iata_code']} – Duplicate skipped";
                continue;
            }

            $notam = Notam::create([
                'airport_id' => $airport['iata_code'],
                'city'       => $airport['city'],
                'message'    => $message,
            ]);

            Http::post('https://n8n.larable.dev/webhook/7789106c-df1f-4ead-b8b8-16332151bd99', [
                'airport_id' => $notam->airport_id,
                'city'       => $notam->city,
                'message'    => $notam->message,
            ]);

            $generated++;
        }

        return response()->json([
            'success'   => $generated > 0,
            'generated' => $generated,
            'failed'    => $failed,
            'errors'    => $errors,
            'message'   => "{$generated} NOTAM(s) generated, {$failed} failed.",
        ]);
    }
}
