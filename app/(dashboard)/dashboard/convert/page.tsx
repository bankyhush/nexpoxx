// /app/dashboard/swap/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Coin {
  id: string;
  name: string;
  fullName: string;
  rate: number;
  photo: string | null;
  balance: number;
}

export default function SwapPage() {
  const { data: user } = useUser();
  const router = useRouter();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Swap state
  const [fromCoin, setFromCoin] = useState<Coin | null>(null);
  const [toCoin, setToCoin] = useState<Coin | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [rate, setRate] = useState(0);
  const [fee] = useState(0.001); // 0.1% fee

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/dashboard_api/listcoins");
        if (!res.ok) throw new Error("Failed to fetch coins");

        const data = await res.json();
        const coinsWithBalance = data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          fullName: coin.fullName,
          rate: parseFloat(coin.spotPrice.replace("$", "")),
          photo: coin.photo,
          balance: parseFloat(coin.holdings), // Crypto units
        }));

        setCoins(coinsWithBalance);
        if (coinsWithBalance.length > 1) {
          setFromCoin(coinsWithBalance[0]);
          setToCoin(coinsWithBalance[1]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load coins");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [router]);

  useEffect(() => {
    if (fromCoin && toCoin) {
      const newRate = fromCoin.rate / toCoin.rate;
      setRate(newRate);
      calculateToAmount();
    }
  }, [fromCoin, toCoin, fromAmount]);

  const calculateToAmount = () => {
    if (!fromAmount || isNaN(parseFloat(fromAmount)) || !fromCoin || !toCoin) {
      setToAmount("");
      return;
    }

    const amount = parseFloat(fromAmount);
    const calculatedAmount = (amount * fromCoin.rate) / toCoin.rate;
    const amountAfterFee = calculatedAmount * (1 - fee);

    setToAmount(amountAfterFee.toFixed(8));
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
  };

  const handleSwapCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
    setFromAmount(toAmount);
  };

  const handleMaxClick = () => {
    if (fromCoin) {
      setFromAmount(fromCoin.balance.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromCoin || !toCoin || !fromAmount || isNaN(parseFloat(fromAmount))) {
      toast.error("Please select coins and enter a valid amount");
      return;
    }

    if (fromCoin.id === toCoin.id) {
      toast.error("Source and target coins cannot be the same");
      return;
    }

    if (parseFloat(fromAmount) > fromCoin.balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (parseFloat(fromAmount) < 0.00000001) {
      toast.error("Amount too small");
      return;
    }

    setIsSubmitting(true);

    try {
      const swapPromise = fetch("/api/dashboard_api/coin-swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromCoinId: fromCoin.id,
          toCoinId: toCoin.id,
          fromAmount: parseFloat(fromAmount),
          toAmount: parseFloat(toAmount),
          userName: user?.fullName || "Unknown",
        }),
      });

      const response = await toast.promise(
        swapPromise,
        {
          loading: "Processing swap...",
          success: "Swap completed successfully!",
          error: (err) => err.message || "Failed to complete swap",
        },
        { duration: 4000 }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to complete swap");
      }

      setFromAmount("");
      setToAmount("");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      // Errors handled by toast.promise
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-gray-900 min-h-screen">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Swap Crypto
        </h1>

        <form onSubmit={handleSubmit}>
          {/* From Coin */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                From
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Balance: {fromCoin?.balance.toFixed(8) || "0.00"}{" "}
                {fromCoin?.name}
              </span>
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex-1">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  placeholder="0.0"
                  className="w-full bg-transparent border-0 text-lg focus-visible:ring-0 dark:text-white"
                  min="0.00000001"
                  step="0.00000001"
                />
              </div>

              <div className="flex items-center">
                {fromCoin?.photo && (
                  <Image
                    src={fromCoin.photo}
                    alt={fromCoin.name}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                )}
                <select
                  value={fromCoin?.id || ""}
                  onChange={(e) => {
                    const selected = coins.find((c) => c.id === e.target.value);
                    if (selected) setFromCoin(selected);
                  }}
                  className="bg-transparent border-0 py-1 pl-2 pr-8 text-sm font-medium focus:outline-none focus:ring-0 dark:text-white"
                >
                  <option value="">Select coin</option>
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-md text-gray-700 dark:text-gray-300"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-4">
            <button
              type="button"
              onClick={handleSwapCoins}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowRightLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* To Coin */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                To
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Balance: {toCoin?.balance.toFixed(8) || "0.00"} {toCoin?.name}
              </span>
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex-1">
                <Input
                  type="text"
                  value={toAmount}
                  readOnly
                  className="w-full bg-transparent border-0 text-lg focus-visible:ring-0 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                {toCoin?.photo && (
                  <Image
                    src={toCoin.photo}
                    alt={toCoin.name}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                )}
                <select
                  value={toCoin?.id || ""}
                  onChange={(e) => {
                    const selected = coins.find((c) => c.id === e.target.value);
                    if (selected) setToCoin(selected);
                  }}
                  className="bg-transparent border-0 py-1 pl-2 pr-8 text-sm font-medium focus:outline-none focus:ring-0 dark:text-white"
                >
                  <option value="">Select coin</option>
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Rate Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 dark:text-gray-400">Rate</span>
              <span className="font-medium dark:text-white">
                1 {fromCoin?.name} = {rate.toFixed(8)} {toCoin?.name}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Fee</span>
              <span className="font-medium dark:text-white">0.10%</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !fromAmount || !toAmount}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? "Swapping..." : "Swap Now"}
          </Button>
        </form>
      </div>
    </div>
  );
}
