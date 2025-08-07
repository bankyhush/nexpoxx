"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

interface CoinData {
  id: string;
  name: string;
  fullName: string;
  wallet: string;
  photo: string | null;
  desc: string;
  cryptoAvail: string;
  availableUsd: string;
}

const WithdrawalPage = () => {
  const { data: user } = useUser();
  const [customAddress, setCustomAddress] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const { id: coinId } = useParams();
  const router = useRouter();

  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true); // Loading for coin data
  const [isLoading, setIsLoading] = useState(false); // Loading for form submission
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      router.push("/dashboard");
      return;
    }

    const fetchCoinData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard_api/payout/${coinId}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const { coin, balance } = await res.json();
        const available = Number(balance?.available ?? 0);
        const cryptoAvail = available / Number(coin.coinRate);

        setCoinData({
          id: coin.id.toString(),
          name: coin.coinName,
          fullName: coin.coinTitle,
          wallet: coin.wallet,
          photo: coin.photo,
          desc: coin.desc,
          availableUsd: available.toFixed(2),
          cryptoAvail: cryptoAvail.toFixed(5),
        });
      } catch (err) {
        console.error("Fetch error:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchCoinData();
  }, [coinId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coinId || !withdrawalAmount || !customAddress) {
      setError("Please provide amount and address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    toast.dismiss();

    const formData = new FormData();
    formData.append("coinId", String(coinId));
    formData.append("amount", withdrawalAmount);
    formData.append("info", customAddress);
    formData.append("userName", user?.fullName || "Unknown");
    if (coinData?.name) formData.append("title", coinData.name);

    try {
      const response = await toast.promise(
        fetch("/api/dashboard_api/payout-payment", {
          method: "POST",
          body: formData,
        }),
        {
          loading: "Processing withdrawal...",
        }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.error || "Withdrawal failed");
      }

      toast.success("Withdrawal initiated successfully!", {
        duration: 4000,
      });
      setTimeout(() => router.push(`/dashboard/overview/${coinId}`), 2000);
    } catch (err: any) {
      toast.error(err.message || "An error occurred during withdrawal.", {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 dark:bg-background/50 dark:text-gray-50 mb-14">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 w-60 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />
          <div className="flex flex-col lg:flex-row gap-8">
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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Form */}
            <div className="flex-1 rounded-xl shadow-lg p-6 lg:p-8 space-y-8 dark:bg-gray-900 dark:text-gray-50">
              {/* Step 1 */}
              <div>
                <h2 className="text-lg font-medium mb-2">
                  Select Cryptocurrency
                </h2>
                <select
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-600"
                  disabled
                >
                  <option value={coinData?.fullName}>
                    {coinData?.name} - {coinData?.fullName}
                  </option>
                </select>
              </div>

              {/* Step 2 */}
              <div>
                <h2 className="text-lg font-medium mb-2">Set Destination</h2>
                <div className="mb-4 flex space-x-4 border-b border-gray-200">
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600"
                    disabled
                  >
                    {coinData?.photo && (
                      <img
                        src={coinData.photo}
                        alt={coinData.name}
                        className="w-6 h-6 rounded-full object-contain"
                      />
                    )}
                    On-Chain Withdrawal
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Network
                  </label>
                  <select
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize dark:bg-gray-800 dark:text-gray-50 dark:border-gray-600"
                    disabled
                  >
                    <option value={coinData?.fullName}>
                      {coinData?.fullName}
                    </option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter address"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-50"
                  />
                  {!customAddress && (
                    <p className="text-sm text-red-500 mt-1 dark:text-red-400">
                      Please enter a valid {coinData?.fullName} address
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Amount to Withdraw (USD)
                </label>
                <Input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  placeholder={`Max: $${coinData?.availableUsd}`}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-50"
                />
                <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                  Available: ${coinData?.availableUsd ?? "$0.00"} ~ &nbsp;
                  {coinData?.cryptoAvail ?? "0.00"} {coinData?.name}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`cursor-pointer flex items-center justify-center w-48 px-4 py-2 rounded-lg text-white ${
                  isLoading
                    ? "bg-gray-500"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Upload className="mr-2 animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Upload className="mr-2" />
                    Withdraw Funds
                  </>
                )}
              </button>
            </div>

            {/* Right Column: FAQ */}
            <div className="w-full lg:w-96 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-900 dark:text-gray-50">
                <h2 className="text-xl font-bold mb-4">FAQ</h2>
                <ul className="space-y-4 text-sm">
                  <li>
                    <strong className="text-gray-900 dark:text-gray-50">
                      How do I make a withdrawal?
                    </strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      Select your cryptocurrency, enter a valid network address,
                      specify the amount, and click "Withdraw Now."
                    </p>
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-50">
                      Why have I not received my withdrawal?
                    </strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      Delays may occur due to network congestion. Contact
                      support if it exceeds 24 hours.
                    </p>
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-50">
                      Can I cancel a withdrawal?
                    </strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      No, withdrawals cannot be canceled once processed.
                    </p>
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-gray-50">
                      Is there a minimum withdrawal amount?
                    </strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      Yes, check the minimum limit for each cryptocurrency.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalPage;
