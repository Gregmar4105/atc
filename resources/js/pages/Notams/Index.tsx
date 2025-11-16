import { useState } from 'react';
import { ScrollArea, Scrollbar } from '@radix-ui/react-scroll-area';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';

interface Notam {
  id: number;
  airport_id: string;
  airport_name: string;
  city?: string;
  message?: string;
  created_at?: string | null;
  airport?: { iata_code?: string; airport_name: string | null } | null;
}

export default function Index() {
  const { notams: initialNotams = [] } = usePage<{ notams?: Notam[] }>().props;
  const [notams, setNotams] = useState(initialNotams);

  // Pagination & search
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [airportSearch, setAirportSearch] = useState('');

  const perPageOptions = [5, 10, 20, 50, 100];

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNotam, setSelectedNotam] = useState<Notam | null>(null);

  const filteredNotams = notams.filter(n =>
    (n.airport?.airport_name ?? n.airport_name ?? '').toLowerCase().includes(airportSearch.toLowerCase())
  );

  const totalItems = filteredNotams.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const paginatedNotams = filteredNotams.slice((safePage - 1) * perPage, safePage * perPage);

  const handleDeleteClick = (notam: Notam) => {
    setSelectedNotam(notam);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedNotam) return;
    router.delete(`/notams/${selectedNotam.id}`, {
      onSuccess: () => {
        setNotams(prev => prev.filter(n => n.id !== selectedNotam.id));
        setDeleteModalOpen(false);
        setSelectedNotam(null);
      },
      onError: () => {
        alert('Failed to delete NOTAM.');
        setDeleteModalOpen(false);
        setSelectedNotam(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Notams', href: '/Notams' }]}>
      <Head title="Notice to Airmen" />
      <div className="flex h-full flex-1 flex-col space-y-3 p-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Notams Table</h1>

        {/* Search Airport */}
        <div className="mb-3 flex items-center space-x-2">
          <label htmlFor="airport-search" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Search Airport:
          </label>
          <input
            id="airport-search"
            type="text"
            value={airportSearch}
            placeholder="Type airport name..."
            onChange={e => { setAirportSearch(e.target.value); setPage(1); }}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            autoComplete="off"
          />
        </div>

        <ScrollArea className="w-full rounded-md border bg-white/50 p-2 dark:bg-gray-900/50">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">IATA</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Airport</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">City</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Message</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Created</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedNotams.length > 0 ? (
                paginatedNotams.map(n => (
                  <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{n.airport?.iata_code ?? n.airport_id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{n.airport?.airport_name ?? '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{n.city ?? '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{n.message ?? '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">{n.created_at ? new Date(n.created_at).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 flex space-x-2">
                      <button onClick={() => router.visit(`/notams/edit?id=${n.id}`)} className="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 transition">Edit</button>
                      <button onClick={() => handleDeleteClick(n)} className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700 transition">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No NOTAMs found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <Scrollbar orientation="horizontal" />

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center">
              <span className="mr-2 text-sm">Rows per page:</span>
              <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1 bg-white dark:bg-gray-900 text-sm">
                {perPageOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className={`px-2 py-1 border rounded text-sm ${safePage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>Prev</button>
              <span className="text-sm px-2">Page {safePage} of {totalPages}</span>
              <button disabled={safePage === totalPages || totalPages === 0} onClick={() => setPage(safePage + 1)} className={`px-2 py-1 border rounded text-sm ${safePage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>Next</button>
            </div>
          </div>
        </ScrollArea>

        {/* Delete Modal */}
        {deleteModalOpen && selectedNotam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-100">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete NOTAM?</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete the NOTAM for <strong>{selectedNotam.airport?.airport_name ?? selectedNotam.airport_id}</strong>?
              </p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
