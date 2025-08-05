"use client";
import { useState, useEffect } from "react";

export default function DashboardBalance() {
  const [totalBalance, setTotalBalance] = useState<string>("0.00");
  const [availableBalance, setAvailableBalance] = useState<string>("0.00");
  const [orderBalance, setOrderBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard_api/totalbalance");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.details?.map((d: any) => d.message).join(", ") ||
              "Failed to load balance"
          );
        }
        const data = await res.json();
        setTotalBalance(data.totalBalance);
        setAvailableBalance(data.availableBalance);
        setOrderBalance(data.orderBalance || "0.00");
      } catch (err: any) {
        console.error("Fetch error:", err);
        setTotalBalance("0.00"); // Fallback to 0.00 on error
        setAvailableBalance("0.00"); // Fallback to 0.00 on error
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
        <div className="flex items-center mb-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mr-2"></div>
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-baseline mb-1">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mr-2"></div>
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="mb-8">
          <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-wrap gap-3">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:shadow-xl dark:bg-gray-900 dark:text-gray-50">
      <div className="flex items-center mb-2">
        <h2 className="text-sm text-gray-600 mr-2">Estimated total value</h2>
        {/* <Eye size={16} className="text-gray-500" /> */}
      </div>

      <div className="flex items-baseline mb-1">
        <h1 className="text-3xl font-bold mr-2">{totalBalance}</h1>
        <span className="text-gray-500 text-sm">USD</span>
      </div>

      <div className="mb-8 text-sm">
        <span className="mr-1">Available&apos;s P/L:</span>
        <span className="text-green-500">
          ${availableBalance}{" "}
          <span className="text-red-500">({orderBalance})</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          Deposit
        </button>
        <button className="bg-white text-black border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors">
          Convert
        </button>
        <button className="bg-white text-black border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors">
          Withdraw
        </button>
        <button className="bg-white text-black border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors">
          Transfer
        </button>
      </div>
    </div>
  );
}
