"use client";

import { useEffect, useState } from "react";
import { Copy, QrCode, Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import VerifyPayment from "./Payment";

interface CoinData {
  id: string;
  name: string;
  fullName: string;
  wallet: string;
  photo: string | null;
  desc: string;
}

const DepositDashboard = () => {
  const { id: coinId } = useParams();
  const router = useRouter();

  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const walletAddress = coinData?.wallet || "";

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
        const res = await fetch(`/api/dashboard_api/deposits/${coinId}`);
        if (!res.ok) {
          router.push("/dashboard");
          return;
        }
        const { coin } = await res.json();

        setCoinData({
          id: coin.id.toString(),
          name: coin.coinName,
          fullName: coin.coinTitle,
          wallet: coin.depositAddress,
          photo: coin.photo || null,
          desc: coin.desc || "No description available.",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [coinId]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white animate-pulse">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="min-h-screen mb-20 p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section */}
            <div className="lg:col-span-2 bg-gray-100 dark:bg-background/50 rounded-lg p-6">
              <div className="space-y-6">
                {/* Coin (mimicking a disabled select) */}
                <div>
                  <label className="block mb-2">Selected Coin</label>
                  <div className="flex items-center space-x-3 bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#333] rounded-md p-3 text-sm cursor-not-allowed">
                    {coinData?.photo && (
                      <img
                        src={coinData.photo}
                        alt={coinData.name}
                        className="w-6 h-6 rounded-full object-contain"
                      />
                    )}
                    <span>{coinData?.name}</span>
                  </div>
                </div>

                {/* Network */}
                <div>
                  <label className="block mb-2">Select Network</label>
                  <select className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-[#333] rounded-md p-3 text-sm">
                    <option key={coinData?.id} value={coinData?.fullName}>
                      {coinData?.fullName}
                    </option>
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure the network you choose for the deposit matches the
                    withdrawal network or your assets may be lost.
                  </p>
                </div>

                {/* Wallet Address */}
                <div>
                  <label className="block mb-2">Address</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={coinData?.wallet}
                      readOnly
                      className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-[#333] rounded-l-md p-3"
                    />
                    <div className="flex">
                      <button
                        onClick={handleCopyAddress}
                        className="bg-white dark:bg-[#0a0a0a] border border-l-0 border-gray-300 dark:border-[#333] p-3 relative"
                      >
                        {copySuccess ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-400" />
                        )}
                        {copySuccess && (
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Copied!
                          </div>
                        )}
                      </button>
                      <button className="bg-white dark:bg-[#0a0a0a] border border-l-0 border-gray-300 dark:border-[#333] rounded-r-md p-3">
                        <QrCode className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirmation Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Expected Arrival</label>
                    <p>1 network confirmation</p>
                  </div>
                  <div>
                    <label className="block mb-2">Coin</label>
                    <p>Only send {coinData?.name}</p>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Network</label>
                  <p>Make sure the network is {coinData?.fullName}</p>
                </div>
              </div>
            </div>
            {/* Help Section */}
            <div className="bg-gray-100 dark:bg-background/50 rounded-lg p-6">
              <h2 className="text-sm font-medium border-b pb-4 mb-4">
                Facing Deposit Issues?
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  Ensure the selected network matches your sending platform.
                </li>
                <li>Double check the wallet address before sending.</li>
                <li>Reach out to support if funds don't arrive in 1 hour.</li>
                <li>{coinData?.desc}</li>
              </ul>
              <div className="mt-6 mb-6">
                <VerifyPayment coinData={coinData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositDashboard;
