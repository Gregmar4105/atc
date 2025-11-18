import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    FaBolt,
    FaCloud,
    FaCloudRain,
    FaCompass,
    FaCompressArrowsAlt,
    FaEye,
    FaSnowflake,
    FaSun,
    FaTemperatureHigh,
    FaTint,
    FaWind,
} from 'react-icons/fa';

//render icons based on conditions
const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
        case 'rain':
            return <FaCloudRain className="text-6xl text-blue-500" />;
        case 'clouds':
            return <FaCloud className="text-6xl text-gray-500" />;
        case 'clear':
            return <FaSun className="text-6xl text-yellow-400" />;
        case 'snow':
            return <FaSnowflake className="text-6xl text-blue-300" />;
        case 'thunderstorm':
            return <FaBolt className="text-6xl text-yellow-500" />;
        default:
            return <FaCloud className="text-6xl text-gray-400" />;
    }
};
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city) return;

        setLoading(true);
        setError(null);
        setWeather(null); // clear old data

        try {
            const res = await fetch(
                `/api/weather?city=${encodeURIComponent(city)}`,
            );

            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('City not found.');
                }
                throw new Error('Failed to fetch weather data.');
            }

            const data = await res.json();

            // If API returns an empty or incomplete result
            if (!data || !data.weather) {
                throw new Error('City not found.');
            }

            setWeather(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch weather data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col space-y-3 p-3">
                {/* Search bar */}
                <div className="flex w-full justify-center">
                    <form
                        onSubmit={fetchWeather}
                        className="flex w-full max-w-lg gap-3 rounded-xl bg-white p-5 shadow-lg transition dark:bg-gray-900"
                    >
                        <input
                            type="text"
                            placeholder="Enter city name"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </form>
                    
                </div>
                {/* Error message */}
                {error && (
                    <div className="flex w-full justify-center">
                        <div className="w-full max-w-lg rounded-lg bg-red-100 p-3 text-center font-medium text-red-700 shadow-md dark:bg-red-900 dark:text-red-300">
                            {error}
                        </div>
                    </div>
                )}


{/* Loading Indicator */}
{loading && (
  <div className="flex w-full justify-center py-6">
    <div className="animate-spin h-12 w-12 rounded-full border-4 border-t-transparent border-blue-500 dark:border-blue-400 shadow-lg"></div>
  </div>
)}
                {/* Weather Result */}
                {weather && (
                    <div className=" flex w-full justify-center">
                        <div className="flex w-full max-w-4xl flex-col items-center justify-between space-y-6 rounded-2xl bg-white p-8 shadow-2xl transition md:flex-row md:space-y-0 md:space-x-6 dark:bg-gray-800 dark:text-white">
                            {/* Left: Details */}
                            <div className=" flex-1 space-y-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className=" text-4xl font-bold">
                                        {weather.name}
                                        {weather.sys?.country
                                            ? `, ${weather.sys.country}`
                                            : ''}
                                    </h2>
                                    {weather.weather?.[0] && (
                                        <div className="flex-shrink-0">
                                            {getWeatherIcon(
                                                weather.weather[0].main,
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-lg">
                                    {/* Time */}
                                    <div>
                                        <strong>Local Time:</strong>{' '}
                                        {new Date().toLocaleString()}
                                    </div>

                                    <div>
                                        <strong>UTC Time:</strong>{' '}
                                        {new Date().toUTCString()}
                                    </div>

                                    {/* Condition */}

                                    {weather.weather?.[0] && (
                                        <>
                                            <div>
                                                <strong>Condition:</strong>{' '}
                                                {weather.weather[0].main}
                                            </div>
                                            <div>
                                                <strong>Description:</strong>{' '}
                                                {weather.weather[0].description}
                                            </div>
                                        </>
                                    )}

                                    {/* Visibility */}
                                    {weather.visibility !== undefined && (
                                        <div className="flex items-center gap-2">
                                            <FaEye className="text-blue-500" />
                                            <span>
                                                <strong>Visibility:</strong>{' '}
                                                {(
                                                    weather.visibility / 1000
                                                ).toFixed(1)}{' '}
                                                km
                                            </span>
                                        </div>
                                    )}

                                    {/* Temperature */}
                                    {weather.main && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <FaTemperatureHigh className="text-red-500" />
                                                <span>
                                                    <strong>Temp:</strong>{' '}
                                                    {weather.main.temp}°C
                                                </span>
                                            </div>
                                            <div>
                                                <strong>Feels Like:</strong>{' '}
                                                {weather.main.feels_like}°C
                                            </div>
                                            <div>
                                                <strong>Min / Max:</strong>{' '}
                                                {weather.main.temp_min}°C /{' '}
                                                {weather.main.temp_max}°C
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaTint className="text-blue-400" />
                                                <span>
                                                    <strong>Humidity:</strong>{' '}
                                                    {weather.main.humidity}%
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaCompressArrowsAlt className="text-gray-500" />
                                                <span>
                                                    <strong>Pressure:</strong>{' '}
                                                    {weather.main.pressure} hPa
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    {/* Wind */}
                                    {weather.wind && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <FaWind className="text-gray-500" />
                                                <span>
                                                    <strong>Wind Speed:</strong>{' '}
                                                    {weather.wind.speed} m/s
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaCompass className="text-yellow-500" />
                                                <span>
                                                    <strong>Direction:</strong>{' '}
                                                    {weather.wind.deg}°
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaWind className="text-gray-400" />
                                                <span>
                                                    <strong>Wind Gust:</strong>{' '}
                                                    {weather.wind.gust ?? 'N/A'}{' '}
                                                    m/s
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
