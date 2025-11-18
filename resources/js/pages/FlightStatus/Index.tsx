import { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";

import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    RowSelectionState,
    useReactTable,
} from "@tanstack/react-table";

interface IFlight {
    id: number;
    flight_number: string;
    airline_code: string;
    origin_code: string;
    destination_code: string;
    aircraft_icao_code: string;
    scheduled_departure_time: string;
    scheduled_arrival_time: string;
    status_id: number;
    status_text: string;
}

interface FlightsDashboardProps {
    flights: IFlight[];
}

export default function FlightsDashboard({ flights: initialFlights }: FlightsDashboardProps) {
    const [flights, setFlights] = useState(initialFlights);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Filter flights based on search
    const filteredFlights = useMemo(() => {
        return flights.filter((f) =>
            [f.flight_number, f.origin_code, f.destination_code]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [flights, search]);

    // Table columns
    const columns = useMemo<ColumnDef<IFlight>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
            ),
            size: 50,
        },
        { accessorKey: "flight_number", header: "Flight Number", size: 120 },
        { accessorKey: "airline_code", header: "Airline", size: 100 },
        { accessorKey: "origin_code", header: "Origin", size: 100 },
        { accessorKey: "destination_code", header: "Destination", size: 100 },
        { accessorKey: "aircraft_icao_code", header: "Aircraft", size: 100 },
        { accessorKey: "scheduled_departure_time", header: "Departure", size: 180 },
        { accessorKey: "scheduled_arrival_time", header: "Arrival", size: 180 },
        {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
        const s = row.original.status_text; // use the new status_text
        const style = "font-bold px-2 py-1 rounded";
        switch (s) {
            case 'Scheduled':
                return <span className={`bg-gray-200 text-gray-700 ${style}`}>{s}</span>;
            case 'Delayed':
                return <span className={`bg-red-100 text-red-600 ${style}`}>{s}</span>;
            case 'Re-route':
                return <span className={`bg-yellow-100 text-yellow-600 ${style}`}>{s}</span>;
            case 'Clear for Landing':
                return <span className={`bg-green-100 text-green-600 ${style}`}>{s}</span>;
            default:
                return <span className={`bg-gray-200 text-gray-700 ${style}`}>{s}</span>;
        }
    },
    size: 150,
}

,
    ], []);

    // Table instance
    const table = useReactTable({
        data: filteredFlights,
        columns,
        pageCount: Math.ceil(filteredFlights.length / pagination.pageSize),
        getRowId: (row) => row.id.toString(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { pagination, rowSelection },
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
    });

    // Update flight status
    const updateStatus = async (statusId: number) => {
        const selectedRows = table.getSelectedRowModel().rows;
        if (!selectedRows.length) return setToastMessage("No flights selected");

        const flightIds = selectedRows.map(r => r.original.id);
        setIsUpdating(true);

        router.post('/FlightStatus/update-status', {
            flight_ids: flightIds,
            status_id: statusId
        }, {
            onSuccess: () => {
                // Update local state
                setFlights(prev =>
                    prev.map(f => flightIds.includes(f.id) ? { ...f, status_id: statusId } : f)
                );
                setRowSelection({});
                setToastMessage("Status updated successfully!");
                setTimeout(() => setToastMessage(null), 3000);
            },
            onError: (errors) => {
                console.error("Update errors:", errors);
                setToastMessage("Failed to update status");
                setTimeout(() => setToastMessage(null), 3000);
            },
            onFinish: () => setIsUpdating(false)
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Flights", href: "/Flights" } as BreadcrumbItem]}>
            <Head title="Flights" />
            <div className="flex flex-col space-y-3 p-3">

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed top-4 right-4 rounded bg-green-600 px-4 py-2 text-white shadow-lg z-50">
                        {toastMessage}
                    </div>
                )}

                {/* Search + Status Buttons */}
                <div className="flex items-center justify-between mb-3">
                    <input
                        type="text"
                        placeholder="Search Flight, Origin or Destination..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => updateStatus(1)} 
                            disabled={isUpdating}
                            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            {isUpdating ? 'Updating...' : 'Scheduled'}
                        </button>
                        <button 
                            onClick={() => updateStatus(2)} 
                            disabled={isUpdating}
                            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {isUpdating ? 'Updating...' : 'Delayed'}
                        </button>
                        <button 
                            onClick={() => updateStatus(3)} 
                            disabled={isUpdating}
                            className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 disabled:opacity-50"
                        >
                            {isUpdating ? 'Updating...' : 'Re-route'}
                        </button>
                        <button 
                            onClick={() => updateStatus(4)} 
                            disabled={isUpdating}
                            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                            {isUpdating ? 'Updating...' : 'Clear for Landing'}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <DataGrid table={table} recordCount={filteredFlights.length}>
                    <div className="w-full overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                        <DataGridContainer>
                            <ScrollArea className="rounded-lg">
                                <DataGridTable />
                                <Scrollbar orientation="horizontal" className="rounded-b-lg" />
                            </ScrollArea>
                        </DataGridContainer>
                        <div className="flex justify-end border-t border-gray-200 px-4 py-2 dark:border-gray-700">
                            <DataGridPagination />
                        </div>
                    </div>
                </DataGrid>
            </div>
        </AppLayout>
    );
}
