import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const features = [
    {
        title: 'Live Flight + Weather Sync',
        copy: 'Blend airline schedules with METAR insights so tower teams react to shifting skies without leaving one screen.',
    },
    {
        title: 'Airport Status Intelligence',
        copy: 'Track open, restricted, and closed fields in real time with automatic NOTAM context and timezone awareness.',
    },
    {
        title: 'Batch NOTAM Automations',
        copy: 'Trigger curated notices, prevent duplicates, and push alerts to n8n workflows whenever conditions change.',
    },
];

const metrics = [
    { label: 'Airports tracked', value: '320+' },
    { label: 'Flights monitored daily', value: '1.2K+' },
    { label: 'Weather lookups / hr', value: '4.8K' },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="ATC Ops Hub" />
            <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div className="absolute -left-32 top-24 h-64 w-64 rounded-full bg-sky-500 blur-3xl" />
                    <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-700 blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500 blur-[140px]" />
                </div>

                <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-200">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-sky-300">
                            ATC
                        </span>
                        Air Traffic Command Center
                    </div>
                    <nav className="flex items-center gap-4 text-sm font-medium text-slate-200">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-full border border-white/10 px-5 py-2 text-sm hover:border-white/40 hover:text-white"
                            >
                                Enter dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-full px-5 py-2 text-sm text-slate-300 transition hover:text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                                >
                                    Create account
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-6 lg:pt-12">
                    <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
                        <div className="space-y-8">
                            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-200">
                                Built for Airport Duty Managers
                            </p>
                            <div className="space-y-4">
                                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                                    A modern command surface for flights, weather, NOTAMs, and airport health.
                                </h1>
                                <p className="text-lg text-slate-300">
                                    The ATC Ops Hub keeps tower teams, dispatch, and airline partners aligned by combining
                                    flight tracking, automated alerting, and a live airport status board in one glass cockpit
                                    experience.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5"
                                    >
                                        Launch control tower
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5"
                                        >
                                            Start for free
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="rounded-2xl border border-white/20 px-6 py-3 text-base font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
                                        >
                                            View live demo
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                {metrics.map((metric) => (
                                    <div key={metric.label}>
                                        <p className="text-2xl font-semibold text-white">{metric.value}</p>
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            {metric.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-100 backdrop-blur">
                            <div className="absolute right-4 top-4 text-xs uppercase tracking-widest text-slate-400">
                                Ops snapshot
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-slate-400">
                                            Manila Tower
                                        </p>
                                        <p className="text-2xl font-semibold text-white">Runway 06 / 24</p>
                                    </div>
                                    <div className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                                        Active
                                    </div>
                                </div>
                                <div className="grid gap-3 rounded-2xl bg-white/5 p-4">
                                    <p className="text-sm uppercase tracking-wide text-slate-400">
                                        Live alerts • last 15 min
                                    </p>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between text-slate-300">
                                            <span className="truncate pr-4">Flight PR421 rerouted</span>
                                            <span className="text-xs text-amber-300">Weather</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-300">
                                            <span className="truncate pr-4">NOTAM batch generated for LAX</span>
                                            <span className="text-xs text-sky-300">Automated</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-300">
                                            <span className="truncate pr-4">Clark Intl wind gust 18kt</span>
                                            <span className="text-xs text-rose-300">Advisory</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-white/5 p-4 text-sm text-slate-300">
                                    “ATC Ops Hub replaced five scattered spreadsheets with a single reliable picture of airport
                                    health. Every shift change now starts with confidence.”
                                    <div className="mt-3 text-xs uppercase tracking-widest text-slate-500">
                                        Duty Manager • NAIA Operations Center
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.title} className="space-y-3 border-white/10 p-4">
                                <div className="text-xs uppercase tracking-[0.35em] text-slate-400">
                                    Feature
                                </div>
                                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                                <p className="text-sm text-slate-300">{feature.copy}</p>
                            </div>
                        ))}
                    </section>

                    <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-8 text-center text-white">
                        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                            Ready for wheels up?
                        </p>
                        <h2 className="text-3xl font-semibold sm:text-4xl">
                            Give your airport a modern landing surface.
                        </h2>
                        <p className="text-base text-slate-300">
                            Onboard your flight desk in minutes, automate NOTAM bursts, and keep every runway decision synced
                            with live weather intelligence.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-white/30 transition hover:-translate-y-0.5"
                            >
                                {auth.user ? 'Open dashboard' : 'Get started'}
                            </Link>
                            {!auth.user && (
                                <Link
                                    href={login()}
                                    className="rounded-2xl border border-white/40 px-6 py-3 text-base font-semibold text-white/90 transition hover:border-white hover:text-white"
                                >
                                    I already have an account
                                </Link>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

