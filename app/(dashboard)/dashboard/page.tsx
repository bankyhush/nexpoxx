"use client";
import { ChevronDown, Bell, ChevronRight, ChevronLeft } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import BubbleLoader from "@/components/loaders/BubbleLoader";
import DashboardCoins from "./Coins";
import DashboardBalance from "./Balance";
import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  createdAt: Date;
  title: string;
}

const DashboardUI = () => {
  const { data: user, isLoading, error } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  if (isLoading) return <BubbleLoader />;

  const allocations = [
    {
      name: "Funding",
      percentage: 99.9,
      value: "<$0.01",
      color: "bg-indigo-400",
    },
    { name: "Trading", percentage: 0, value: "$0", color: "bg-gray-300" },
    { name: "Earn", percentage: 0, value: "$0", color: "bg-gray-300" },
  ];

  const tabs = [
    { name: "Overview", active: true },
    { name: "Funding", active: false },
    { name: "Trading", active: false },
    { name: "Grow", active: false },
    { name: "Analysis", active: false },
    { name: "Order center", active: false },
    { name: "Account statement", active: false },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const res = await fetch(
          `/api/dashboard_api/transactions?page=${currentPage}`
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
  }, [currentPage, user]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Sub Navigation */}
        <div className="border-b border-gray-200 shadow-sm bg-white">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <div
                  key={tab.name}
                  className={`px-6 py-4 whitespace-nowrap cursor-pointer text-sm font-medium transition-colors ${
                    tab.active
                      ? "text-black border-b-2 border-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {tab.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow bg-gray-800/60 text-black">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Balance Card */}
                <DashboardBalance />
                {/* Assets List */}
                <DashboardCoins />
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6">
                {/* Allocation Section */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="flex items-center justify-between p-6 cursor-pointer">
                    <h2 className="text-xl font-semibold">Allocation</h2>
                    <ChevronDown size={20} className="text-gray-500" />
                  </div>

                  <div className="px-6 pb-6">
                    <div className="h-3 flex rounded-full overflow-hidden mb-6">
                      {allocations.map((item, index) => (
                        <div
                          key={index}
                          className={`${item.color} h-full transition-all`}
                          style={{
                            width: `${item.percentage}%`,
                            minWidth: item.percentage > 0 ? "4px" : "0",
                          }}
                        />
                      ))}
                    </div>

                    {allocations.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between mb-4 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full ${item.color} mr-2`}
                          />
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-right">{item.value}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            {item.percentage > 0
                              ? `${item.percentage.toFixed(1)}%`
                              : ""}
                          </span>
                          <ChevronRight
                            size={16}
                            className="text-gray-400 ml-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transactions Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Recent Transactions
                  </h2>

                  {loadingTransactions ? (
                    <div className="flex items-center justify-center py-10">
                      <BubbleLoader />
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Bell size={24} className="text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        No records found
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Get started with your first transaction
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-900 dark:text-gray-100">
                          <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-700">
                              <th className="py-2 text-left">Type</th>
                              <th className="py-2 text-left">Amount</th>
                              <th className="py-2 text-left">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((t) => (
                              <tr
                                key={t.id}
                                className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <td className="py-2">{t.type}</td>
                                <td className="py-2">${t.amount.toFixed(2)}</td>
                                <td className="py-2">
                                  {new Date(t.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span>
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardUI;
