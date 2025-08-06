"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

const WithdrawalPage = () => {
  const [customAddress, setCustomAddress] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const loading = false; // Set to true to test skeleton

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 dark:bg-background/50 dark:text-gray-50 mb-14">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 w-60 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Skeleton Form */}
            <div className="flex-1 space-y-6 p-6 rounded-xl shadow-lg dark:bg-gray-900">
              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />

              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />

              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />

              <div className="h-12 w-full rounded-lg bg-gray-400 dark:bg-gray-700 animate-pulse" />
            </div>

            {/* Right Skeleton FAQ */}
            <div className="w-full lg:w-96 space-y-4">
              <div className="p-6 rounded-xl shadow-lg dark:bg-gray-900">
                <div className="h-6 w-32 mb-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 dark:bg-background/50 dark:text-gray-50 mb-14">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Withdraw Funds</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Form */}
          <div className="flex-1 rounded-xl shadow-lg p-6 lg:p-8 space-y-8 dark:bg-gray-900 dark:text-gray-50">
            {/* Step 1 */}
            <div>
              <h2 className="text-lg font-medium mb-2">
                Select Cryptocurrency
              </h2>
              <select className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="1">USDT - Tether</option>
              </select>
            </div>

            {/* Step 2 */}
            <div>
              <h2 className="text-lg font-medium mb-2">Set Destination</h2>

              <div className="mb-4 flex space-x-4 border-b border-gray-200">
                <button className="px-4 py-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600">
                  On-Chain Withdrawal
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Network
                </label>
                <select className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="1">Ethereum</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Address</label>
                </div>

                <Input
                  type="text"
                  placeholder="Enter address"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="w-full pr-10 py-5 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                {!customAddress && (
                  <p className="text-sm text-red-500 mt-1">
                    Please enter a withdrawal address
                  </p>
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div className="-mt-7">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Set Withdrawal Amount
              </h2>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-sm text-gray-500 mt-2">Available: 0.00 USDT</p>
            </div>

            <button
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
              disabled={!customAddress || !withdrawalAmount}
              type="button"
            >
              Withdraw Now
            </button>
          </div>

          {/* Right Column: FAQ */}
          <div className="w-full lg:w-96 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-900 dark:text-gray-50">
              <h2 className="text-xl font-bold mb-4">FAQ</h2>
              <ul className="space-y-4 text-sm">
                <li>How do I make a withdrawal?</li>
                <li>Why have I still not received my withdrawal?</li>
                <li>
                  How do I select the correct network for my crypto withdrawals?
                </li>
                <li>Do I need to pay fees for withdrawal?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;
