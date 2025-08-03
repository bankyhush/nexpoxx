"use client";

import { Eye, Download, Upload, BarChart, Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const transactions = [
  { id: 1, type: "Deposit", amount: 500, date: "2025-08-01" },
  { id: 2, type: "Withdraw", amount: 200, date: "2025-07-30" },
  { id: 3, type: "Convert", amount: 150, date: "2025-07-28" },
];

interface CoinData {
  id: string;
  name: string;
  fullName: string;
  holdings: string;
  holdingsUsd: string;
  spotPrice: string;
  photo: string | null;
}

const OverviewPage = () => {
  const searchParams = useSearchParams();
  const coinId = searchParams.get("coinId");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"history" | "about">("history");
  const [totalBalance, setTotalBalance] = useState<string>("0.00");
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = coinId
          ? `/api/dashboard_api/overview?coinId=${coinId}`
          : "/api/dashboard_api/total-balance";
        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.details?.map((d: any) => d.message).join(", ") ||
              "Failed to load data"
          );
        }
        const data = await res.json();
        if (coinId && data.id) {
          setCoinData(data);
        } else {
          setTotalBalance(data.totalBalance || "0.00");
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setTotalBalance("0.00");
        setCoinData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coinId]);

  const filteredTransactions = transactions.filter((t) =>
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-60 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-end space-x-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="text-sm mt-1">
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-60 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
          </div>
          <div className="mt-10">
            <div className="flex gap-6 border-b pb-2 mb-6">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-60 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            {coinData && coinData.photo ? (
              <img
                src={coinData.photo}
                alt={`${coinData.name} logo`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: "#23292F", color: "white" }}
              >
                {coinData ? coinData.name.charAt(0) : "O"}
              </div>
            )}
            <div>
              <h1 className="font-semibold text-xl capitalize">
                {coinData ? coinData.name : "Overview"}
              </h1>
              <p className="text-gray-500 text-sm uppercase">
                {coinData ? coinData.fullName : "Portfolio Summary"}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Value */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm text-gray-500">Estimated Total Value</h2>
            <Eye size={18} className="text-gray-400" />
          </div>
          <div className="flex items-end space-x-2">
            <h1 className="text-3xl font-bold">
              {coinData ? coinData.holdingsUsd : totalBalance}
            </h1>
            <span className="text-sm text-gray-500">USD</span>
          </div>
          <div className="text-sm mt-1">
            <span className="text-gray-500 mr-1">Today’s P/L:</span>
            <span className="text-green-600 font-medium">$0.00 (0.00%)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Deposit", icon: Download },
            { label: "Withdraw", icon: Upload },
            { label: "Convert", icon: BarChart },
            { label: "Notifications", icon: Bell },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex items-center justify-center bg-white rounded-lg border py-3 text-sm font-medium hover:shadow transition"
            >
              <Icon className="mr-2 text-gray-600" size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Assets Summary */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Asset Summary</h3>
            <div className="border-t pt-4">
              {coinData ? (
                <div>
                  <div className="flex items-center mb-2">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-3"
                      style={{
                        backgroundColor: coinData.photo
                          ? "transparent"
                          : "#23292F",
                        color: coinData.photo ? "inherit" : "white",
                      }}
                    >
                      {coinData.photo ? (
                        <img
                          src={coinData.photo}
                          alt={`${coinData.name} logo`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        coinData.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{coinData.name}</h4>
                      <p className="text-sm text-gray-500">
                        {coinData.fullName}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Holdings: {coinData.holdings} ({coinData.holdingsUsd})
                  </p>
                  <p className="text-sm text-gray-600">
                    Spot Price: {coinData.spotPrice}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  You currently have no holdings.
                </p>
              )}
            </div>
          </div>

          {/* Allocation */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Allocation</h3>
            <div className="h-3 rounded-full bg-gray-200 mb-4 overflow-hidden">
              <div className="w-[80%] h-full bg-indigo-500"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Funding</span>
              <span>80%</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Trading</span>
              <span>20%</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="flex gap-6 border-b pb-2 mb-6">
            <button
              className={`text-sm font-medium ${
                activeTab === "history"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Recent History
            </button>
            <button
              className={`text-sm font-medium ${
                activeTab === "about"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
              onClick={() => setActiveTab("about")}
            >
              About Coin
            </button>
          </div>

          {activeTab === "history" ? (
            <>
              {/* Search Bar */}
              <div className="relative mb-4 max-w-md">
                <input
                  type="text"
                  placeholder="Search transaction type..."
                  className="w-full border px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
              </div>

              {/* Transactions */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-6">
                  Recent Transactions
                </h3>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Bell className="text-gray-400" size={24} />
                    </div>
                    <h4 className="text-gray-600 font-medium mb-2">
                      No transactions found
                    </h4>
                    <p className="text-sm text-gray-500">
                      Once you make a deposit or trade, transactions will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2">Type</th>
                        <th className="py-2">Amount</th>
                        <th className="py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((t) => (
                        <tr key={t.id} className="border-b hover:bg-gray-50">
                          <td className="py-2">{t.type}</td>
                          <td className="py-2">${t.amount.toFixed(2)}</td>
                          <td className="py-2">{t.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            // About Coin Tab Content
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">About Coin</h3>
              {coinData ? (
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {coinData.name} ({coinData.fullName}) is a cryptocurrency
                    operating on its respective blockchain. Launched on an
                    unspecified date, it serves a unique use case with a market
                    cap and supply metrics to be detailed.
                  </p>
                  <ul className="list-disc list-inside mt-4 text-sm text-gray-700 space-y-2">
                    <li>Token: {coinData.name}</li>
                    <li>Spot Price: {coinData.spotPrice}</li>
                    <li>
                      Holdings: {coinData.holdings} ({coinData.holdingsUsd})
                    </li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    This section provides general information about the coin or
                    asset. You can display a coin’s purpose, technology, team,
                    and market performance here. If this were a real coin
                    profile, you might include data like:
                  </p>
                  <ul className="list-disc list-inside mt-4 text-sm text-gray-700 space-y-2">
                    <li>Token name and symbol</li>
                    <li>Blockchain it operates on</li>
                    <li>Use case or utility</li>
                    <li>Launch date and founders</li>
                    <li>Market cap and supply metrics</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
