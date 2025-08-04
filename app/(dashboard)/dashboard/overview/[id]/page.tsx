"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, Upload, BarChart, Bell, Search } from "lucide-react";

interface CoinData {
  id: string;
  name: string;
  fullName: string;
  holdings: string;
  holdingsUsd: string;
  spotPrice: string;
  photo: string | null;
  desc: string;
  availableUsd: string;
  staked: string;
  onOrder: string;
}

const OverviewPage = () => {
  const { id: coinId } = useParams();
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"history" | "about">("history");

  useEffect(() => {
    if (!coinId) return;

    const fetchCoinData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard_api/overviews/${coinId}`);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to load coin data");
        }

        const { coin, balance } = await res.json();

        const available = Number(balance?.available ?? 0);
        const onOrder = Number(balance?.onOrder ?? 0);
        const staked = Number(balance?.staked ?? 0);
        const total = available + onOrder + staked;
        const usd = total / Number(coin.coinRate);

        setCoinData({
          id: coin.id.toString(),
          name: coin.coinName,
          fullName: coin.coinTitle,
          availableUsd: `$${available.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          staked: `$${staked.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          onOrder: `$${onOrder.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          holdings: total.toFixed(2),
          holdingsUsd: usd < 0.01 ? "<$0.01" : `${usd.toFixed(5)}`,
          spotPrice: `$${Number(coin.coinRate).toFixed(3)}`,
          photo: coin.photo || null,
          desc: coin.desc || "No description available.",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setCoinData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [coinId]);

  const transactions = [
    { id: 1, type: "Deposit", amount: 500, date: "2025-08-01" },
    { id: 2, type: "Withdraw", amount: 200, date: "2025-07-30" },
    { id: 3, type: "Convert", amount: 150, date: "2025-07-28" },
  ];

  const filteredTransactions = transactions.filter((t) =>
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 💡 Use your existing skeleton component here (not repeated for brevity)
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
        {/* HEADER */}
        <div className="mb-8 flex items-center space-x-3">
          {coinData?.photo ? (
            <img
              src={coinData.photo}
              alt={`${coinData.name} logo`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
              {coinData?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold">{coinData?.name}</h1>
            <p className="text-sm text-gray-500 uppercase">
              {coinData?.fullName}
            </p>
          </div>
        </div>

        {/* PORTFOLIO VALUE */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm text-gray-500">Available Value</h2>
          </div>
          <div className="flex items-end space-x-2">
            <h1 className="text-3xl font-bold">
              {coinData?.availableUsd ?? "$0.00"}
            </h1>
          </div>
          <div className="text-sm mt-1">
            <span className="text-orange-500 mr-1">Staked's P/L:</span>
            <span className="text-orange-600 font-medium">
              {coinData?.staked}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <a
            href="/deposit"
            className="cursor-pointer flex items-center justify-center bg-white rounded-lg border py-3 text-sm font-medium hover:shadow"
          >
            <Download className="mr-2 text-gray-600" size={18} />
            Deposit
          </a>

          <a
            href="/withdraw"
            className="cursor-pointer flex items-center justify-center bg-white rounded-lg border py-3 text-sm font-medium hover:shadow"
          >
            <Upload className="mr-2 text-gray-600" size={18} />
            Withdraw
          </a>

          <a
            href="/convert"
            className="cursor-pointer flex items-center justify-center bg-white rounded-lg border py-3 text-sm font-medium hover:shadow"
          >
            <BarChart className="mr-2 text-gray-600" size={18} />
            Convert
          </a>

          <a
            href="/notifications"
            className="cursor-pointer flex items-center justify-center bg-white rounded-lg border py-3 text-sm font-medium hover:shadow"
          >
            <Bell className="mr-2 text-gray-600" size={18} />
            Notify
          </a>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Asset Summary */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Asset Summary</h3>
            {coinData ? (
              <div>
                <p className="text-sm text-gray-600">
                  Holdings: ${coinData.holdings} ({coinData.holdingsUsd} &nbsp;
                  {coinData?.name})
                </p>
                <p className="text-sm text-gray-600">
                  Spot Price: {coinData.spotPrice}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No coin data available.</p>
            )}
          </div>

          {/* Allocation */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Allocation</h3>
            <div className="h-3 rounded-full bg-gray-200 mb-4 overflow-hidden">
              <div className="w-[80%] h-full bg-orange-500"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Funding</span>
              <span>{coinData?.availableUsd ?? "$0.00"}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Trading</span>
              <span>{coinData?.onOrder}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Staking</span>
              <span>{coinData?.staked ?? "$0.00"}</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-10">
          <div className="flex gap-6 border-b pb-2 mb-6">
            {["history", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "history" | "about")}
                className={`text-sm font-medium ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                {tab === "history" ? "Recent History" : "About Coin"}
              </button>
            ))}
          </div>

          {activeTab === "history" ? (
            <>
              {/* Search */}
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
                  <p className="text-sm text-gray-500">
                    No transactions found.
                  </p>
                ) : (
                  <table className="w-full text-sm">
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
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">About Coin</h3>
              {coinData ? (
                <p className="text-sm text-gray-600">{coinData.desc}</p>
              ) : (
                <p className="text-sm text-gray-500">Coin data not found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
