"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Upload, X } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";

interface CoinData {
  id: string;
  name: string;
  fullName: string;
  wallet: string;
  photo: string | null;
  desc: string;
}

// Type for useParams to ensure coinId is handled correctly
type Params = {
  id: string;
};

const VerifyPayment = ({ coinData }: { coinData: CoinData | null }) => {
  const { id: coinId } = useParams() as Params;
  const router = useRouter();

  const { data: user } = useUser();

  const [amount, setAmount] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  //   const [showToast, setShowToast] = useState(false);
  //   const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coinId || !amount || !photo) {
      setError("Please provide amount and photo.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    toast.dismiss();

    const formData = new FormData();
    formData.append("coinId", coinId);
    formData.append("amount", amount);
    formData.append("photo", photo);
    formData.append("userName", user?.fullName || "Unknown");
    if (coinData?.name) formData.append("title", coinData.name);

    try {
      const res = await toast.promise(
        fetch("/api/dashboard_api/verify-payment", {
          method: "POST",
          body: formData,
        }),
        {
          loading: "Verifying...",
          success: "Payment verification submitted successfully!",
          error: "Verification failed",
        }
      );

      const text = await res.text(); // Read once
      console.log("Response status:", res.status);
      console.log("Response text:", text);

      if (!res.ok) {
        throw new Error(text || "Verification failed");
      }

      const data = JSON.parse(text); // Parse the text into JSON
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push(`/dashboard/overview/${coinId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, coinId, router]);

  return (
    <div className="bg-gray-100 dark:bg-background/50 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Verify Payment</h2>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-[#333] rounded-md p-3 text-sm"
            placeholder="Enter amount"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm">Upload Photo Proof</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-[#333] rounded-md p-3 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full bg-indigo-600 text-white rounded-md py-2 flex items-center justify-center hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            <span className=" animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full mr-2"></span>
          ) : (
            <Upload className="mr-2" />
          )}
          {loading ? "Verifying..." : "Verify Payment"}
        </button>
      </form>
    </div>
  );
};

// CSS animation for sliding in
const styles = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
`;

export default VerifyPayment;
