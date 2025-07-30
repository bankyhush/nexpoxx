"use client";
import React, { useState } from "react";
import { Search, ChevronDown, Bell, Eye, ChevronRight } from "lucide-react";

const DashboardUI = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hideSmallAssets, setHideSmallAssets] = useState(false);

  const assets = [
    {
      id: "xrp",
      name: "XRP",
      fullName: "Ripple",
      holdings: "0.00000091",
      holdingsUsd: "<$0.01",
      spotPrice: "--",
      priceChange: "--",
      style: { backgroundColor: "#23292F", color: "white" },
    },
    {
      id: "sol",
      name: "SOL",
      fullName: "Solana",
      holdings: "<0.00000001",
      holdingsUsd: "<$0.01",
      spotPrice: "--",
      priceChange: "--",
      style: {
        background: "linear-gradient(45deg, #9945FF, #14F195)",
        color: "white",
      },
    },
    {
      id: "usdt",
      name: "USDT",
      fullName: "Tether",
      holdings: "0.00000001",
      holdingsUsd: "<$0.01",
      spotPrice: "--",
      priceChange: "--",
      style: { backgroundColor: "#26A17B", color: "white" },
    },
    {
      id: "trx",
      name: "TRX",
      fullName: "TRON",
      holdings: "<0.00000001",
      holdingsUsd: "$0",
      spotPrice: "--",
      priceChange: "--",
      style: { backgroundColor: "#EF0027", color: "white" },
    },
  ];

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
    { name: "Fees", active: false },
    { name: "Account statement", active: false },
    { name: "PoR reports", active: false },
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen ">
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
                <div className="bg-white  rounded-xl shadow-lg p-6 transform transition-all hover:shadow-xl">
                  <div className="flex items-center mb-2">
                    <h2 className="text-sm text-gray-600 mr-2">
                      Estimated total value
                    </h2>
                    <Eye size={16} className="text-gray-500" />
                  </div>

                  <div className="flex items-baseline mb-1">
                    <h1 className="text-3xl font-bold mr-2">0.00</h1>
                    <span className="text-gray-500 text-sm">USD</span>
                  </div>

                  <div className="mb-8 text-sm">
                    <span className="mr-1">Today&apos;s P/L:</span>
                    <span className="text-green-500">$0.00 (0.00%)</span>
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

                {/* Assets List */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Assets</h2>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                      <div className="relative w-full sm:w-auto">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search assets"
                          className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="hideSmall"
                          checked={hideSmallAssets}
                          onChange={(e) => setHideSmallAssets(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-0 cursor-pointer"
                        />
                        <label
                          htmlFor="hideSmall"
                          className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          Hide small assets
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-sm text-gray-500 border-t border-b border-gray-200">
                          <th className="text-left px-6 py-3 font-medium">
                            Name
                          </th>
                          <th className="text-right px-6 py-3 font-medium">
                            Holdings
                          </th>
                          <th className="text-right px-6 py-3 font-medium">
                            Spot Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.map((asset) => (
                          <tr
                            key={asset.id}
                            className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div
                                  style={{
                                    ...asset.style,
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {asset.name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                  <div className="font-medium">
                                    {asset.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {asset.fullName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="font-medium">
                                {asset.holdings}
                              </div>
                              <div className="text-sm text-gray-500">
                                {asset.holdingsUsd}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="font-medium">
                                {asset.spotPrice}
                              </div>
                              <div className="text-sm text-gray-500">
                                {asset.priceChange}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                    Recent transactions
                  </h2>

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
