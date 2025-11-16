// ...existing code...
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, Scrollbar } from '@radix-ui/react-scroll-area';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';


import { Head, usePage } from '@inertiajs/react';


export default function Index() {
    // Pull notams from Inertia props
    const { notams } = usePage<{
        notams: Array<{
            id: number;
            airport_id: string;
            airport_name: string;
            city?: string;
            message?: string;
            created_at?: string | null;
            airport?: { iata_code?: string;  airport_name: string | null } | null;
        }>;
    }>().props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Notams', href: '/Notams' }]}>
            <Head title="Notice to air man" />
            <div className="flex h-full flex-1 flex-col space-y-3 p-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Notams Table
                </h1>

                <ScrollArea className="w-full rounded-md border bg-white/50 p-2 dark:bg-gray-900/50">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">IATA</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Airport</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">City</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Message</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {notams && notams.length > 0 ? (
                                notams.map((n) => (
                                    <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {n.airport?.iata_code ?? n.airport_id}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {n.airport?. airport_name ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {n.city ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {n.message ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {n.created_at ? new Date(n.created_at).toLocaleString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No NOTAMs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Scrollbar orientation="horizontal" />
                </ScrollArea>
            </div>
        </AppLayout>
    );
}
