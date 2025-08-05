"use client";

import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { Download, Upload, BarChart, Bell, Search } from "lucide-react";
import Link from "next/link";

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

interface Transaction {
  id: number;
  type: string;
  amount: number;
  createdAt: Date;
  status?: string;
  title: string;
}

const OverviewPage = () => {
  const { id: coinId } = useParams();
  const router = useRouter();

  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"history" | "about">("history");

  // Dark mode state
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (!coinId) {
      redirect("/dashboard");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch coin data
        const coinRes = await fetch(`/api/dashboard_api/overviews/${coinId}`);
        if (!coinRes.ok) {
          redirect("/dashboard");
        }
        const { coin, balance } = await coinRes.json();

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
          holdingsUsd: usd < 0.01 ? "<$0.00" : `${usd.toFixed(5)}`,
          spotPrice: `$${Number(coin.coinRate).toFixed(3)}`,
          photo: coin.photo || null,
          desc: coin.desc || "No description available.",
        });

        // Fetch transactions
        const transRes = await fetch(
          `/api/dashboard_api/transactions/${coinId}`
        );
        if (!transRes.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const fetchedTransactions = await transRes.json();
        setTransactions(fetchedTransactions);
      } catch (err) {
        console.error("Fetch error:", err);
        setCoinData(null);
        setTransactions([]);
        redirect("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId, router]);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-900 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-60 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
          </div>
          <div className="bg-white dark:bg-gray-500 rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
            </div>
            <div className="flex items-end space-x-2">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
            </div>
            <div className="text-sm mt-1">
              <div className="h-4 w-36 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-12 w-full bg-gray-200 dark:bg-gray-900 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-500 p-6 rounded-xl shadow-sm">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-900 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-60 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
            </div>
            <div className="bg-white dark:bg-gray-500 p-6 rounded-xl shadow-sm">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-900 rounded animate-pulse mb-4"></div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-900 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-900 rounded animate-pulse mt-2"></div>
            </div>
          </div>
          <div className="mt-10">
            <div className="flex gap-6 border-b pb-2 mb-6">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
            </div>
            <div className="bg-white dark:bg-gray-500 p-6 rounded-xl shadow-sm">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-900 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-60 bg-gray-200 dark:bg-gray-900 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coinData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background/50 py-10 px-4 text-gray-900 dark:text-gray-100 mb-14">
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
            <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg">
              {coinData?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold">{coinData?.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
              {coinData?.fullName}
            </p>
          </div>
        </div>

        {/* PORTFOLIO VALUE */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm text-gray-500 dark:text-gray-400">
              Available Value
            </h2>
          </div>
          <div className="flex items-end space-x-2">
            <h1 className="text-3xl font-bold">
              {coinData?.availableUsd ?? "$0.00"}
            </h1>
          </div>
          <div className="text-sm mt-1">
            <span className="text-orange-500 dark:text-orange-400 mr-1">
              Staked's P/L:
            </span>
            <span className="text-orange-600 dark:text-orange-500 font-medium">
              {coinData?.staked}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              href: `/dashboard/deposit/${coinId}`,
              icon: Download,
              label: "Deposit",
            },
            {
              href: `/dashboard/withdraw/${coinId}`,
              icon: Upload,
              label: "Withdraw",
            },
            { href: "/convert", icon: BarChart, label: "Convert" },
            { href: "/support", icon: Bell, label: "Support" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              className="cursor-pointer flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 py-3 text-sm font-medium hover:shadow transition"
            >
              <Icon
                className="mr-2 text-gray-600 dark:text-gray-300"
                size={18}
              />
              {label}
            </Link>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Asset Summary */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Asset Summary</h3>
            {coinData ? (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Holdings: ${coinData.holdings} ({coinData.holdingsUsd} &nbsp;
                  {coinData?.name})
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Spot Price: {coinData.spotPrice}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No coin data available.
              </p>
            )}
          </div>

          {/* Allocation */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Allocation</h3>
            <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 overflow-hidden">
              <div className="w-[80%] h-full bg-orange-500 dark:bg-orange-400"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span>Funding</span>
              <span>{coinData?.availableUsd ?? "$0.00"}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span>Trading</span>
              <span>{coinData?.onOrder}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Staking</span>
              <span>{coinData?.staked ?? "$0.00"}</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-10">
          <div className="flex gap-6 border-b border-gray-300 dark:border-gray-700 pb-2 mb-6">
            {["history", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "history" | "about")}
                className={`text-sm font-medium ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
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
                  className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
                />
              </div>

              {/* Transactions */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
                  Recent Transactions
                </h3>
                {filteredTransactions.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No transactions found.
                  </p>
                ) : (
                  <table className="w-full text-sm text-gray-900 dark:text-gray-100">
                    <thead>
                      <tr className="border-b border-gray-300 dark:border-gray-700">
                        <th className="py-2 text-left">Method</th>
                        <th className="py-2 text-left">Type</th>
                        <th className="py-2 text-left">Amount</th>
                        <th className="py-2 text-left">Date</th>
                        <th className="py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((t) => (
                        <tr
                          key={t.id}
                          className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="py-2">
                            <img
                              src={coinData.photo || t.title}
                              alt={`${coinData.name} logo`}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          </td>
                          <td className="py-2">{t.type}</td>
                          <td className="py-2">${t.amount.toFixed(2)}</td>
                          <td className="py-2">
                            {new Date(t.createdAt).toLocaleDateString()}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                About Coin
              </h3>
              {coinData ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {coinData.desc}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coin data not found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
