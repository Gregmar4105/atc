import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ScrollArea, Scrollbar } from '@radix-ui/react-scroll-area';
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

interface IAirport {
    id: string;
    iata_code: string;
    airport_name: string;
    city: string;
    country: string;
    airport_status: string;
    timezone: string;
}

export default function Index({ airports }: { airports: IAirport[] }) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'airport_name', desc: false },
    ]);

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const columns = useMemo<ColumnDef<IAirport>[]>(
        () => [
            { accessorKey: 'iata_code', header: 'IATA Code', size: 100 },
            { accessorKey: 'airport_name', header: 'Airport Name', size: 200 },
            { accessorKey: 'city', header: 'City', size: 150 },
            { accessorKey: 'country', header: 'Country', size: 150 },
            { accessorKey: 'airport_status', header: 'Status', size: 120 },
            { accessorKey: 'timezone', header: 'Timezone', size: 150 },
        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: airports,
        pageCount: Math.ceil((airports?.length || 0) / pagination.pageSize),
        getRowId: (row: IAirport) => row.id,
        state: { pagination, sorting },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const generateAllNotams = async () => {
        setLoading(true);
        setNotification(null);

        try {
            // Take first 10 airports
            const batch = airports.slice(28, 30);

            const response = await fetch('/api/generate-batch-notams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ airports: batch }),
            });

            const data = await response.json();

            if (data.success) {
                setNotification(data.message);
                router.reload();
            } else {
                setNotification('Error generating NOTAMs');
            }
        } catch (err) {
            setNotification('Error generating NOTAMs');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Airports', href: '/Airports' }]}>
            <Head title="Airports" />
            <div className="flex h-full flex-1 flex-col space-y-3 p-3">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    Airports Table
                </h1>

                <DataGrid table={table} recordCount={airports?.length || 0}>
                    <div className="w-full space-y-2.5 overflow-hidden rounded-lg bg-white shadow-md transition dark:bg-gray-800">
                        <DataGridContainer>
                            <ScrollArea className="rounded-lg">
                                <DataGridTable />
                                <Scrollbar
                                    orientation="horizontal"
                                    className="rounded-b-lg"
                                />
                            </ScrollArea>
                        </DataGridContainer>

                        <div className="flex justify-end border-t border-gray-200 px-4 py-2 dark:border-gray-700">
                            <DataGridPagination />
                        </div>
                    </div>
                </DataGrid>

                {/* Button for Generating all NOTAMs button */}
                <div className="mt-4 flex flex-col items-center space-y-2">
                    <button
                        onClick={generateAllNotams}
                        disabled={loading}
                        className={`rounded-md px-6 py-2 text-white transition ${
                            loading
                                ? 'cursor-not-allowed bg-gray-400'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center space-x-2">
                                <svg
                                    className="h-5 w-5 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                                <span>Generating NOTAMs...</span>
                            </span>
                        ) : (
                            'Generate All NOTAMs (10)'
                        )}
                    </button>

                    {/* Notification */}
                    {notification && (
                        <div className="animate-fade-in rounded-md bg-blue-600 px-4 py-2 text-white">
                            {notification}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
