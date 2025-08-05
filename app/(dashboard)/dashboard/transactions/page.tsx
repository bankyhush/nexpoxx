"use client";
import { Bell, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import BubbleLoader from "@/components/loaders/BubbleLoader";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  createdAt: Date;
  status: string;
  title: string;
}

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const TransactionsPage = () => {
  const { data: user, isLoading } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce for 300ms

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const res = await fetch(
          `/api/dashboard_api/transactions?page=${currentPage}&search=${debouncedSearchTerm}`
        );
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Fetch error:", err);
        setTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }
    };

    if (user) fetchTransactions();
  }, [currentPage, debouncedSearchTerm, user]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading) return <BubbleLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 dark:bg-background/50 dark:text-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="mt-2 text-sm ">
            View and manage all your transactions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by type, coin, or status..."
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1); // Reset to first page when searching
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-900">
          {loadingTransactions ? (
            <div className="flex items-center justify-center py-12">
              <BubbleLoader />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No transactions found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or create a new transaction.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900 font-bold">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                        Coin
                      </th>
                      <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                        Amount (USD)
                      </th>
                      <th className="px-6 py-3 text-left text-xs  uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                    {transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {t.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {t.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          $
                          {t.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-2">
                          {(() => {
                            let className = "text-gray-600 bg-gray-100"; // default

                            if (t.status === "Pending") {
                              className = "text-yellow-600 bg-yellow-100";
                            } else if (t.status === "Submit") {
                              className = "text-blue-600 bg-blue-100";
                            } else if (t.status === "Approved") {
                              className = "text-green-600 bg-green-100";
                            } else if (t.status === "Processing") {
                              className = "text-purple-600 bg-purple-100";
                            } else if (t.status === "Cancelled") {
                              className = "text-red-600 bg-red-100";
                            }

                            return (
                              <span
                                className={`px-2 py-1 rounded-sm text-sm font-medium ${className}`}
                              >
                                {t.status}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm ">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
