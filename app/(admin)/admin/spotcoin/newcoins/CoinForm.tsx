"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminCoinForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    coinName: "",
    coinTitle: "",
    coinRate: "",
    photo: "",
    withMin: "",
    withMax: "",
    withInstructions: "",
    depositInstructions: "",
    depositAddress: "",
    percent: "",
    desc: "",
    coinVisible: "true",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    const payload = {
      ...form,
      coinRate: parseFloat(form.coinRate),
      withMin: form.withMin ? parseInt(form.withMin, 10) : undefined,
      withMax: form.withMax ? parseInt(form.withMax, 10) : undefined,
      percent: form.percent ? form.percent.toString() : undefined,
      coinVisible: form.coinVisible === "true",
    };

    try {
      await toast.promise(
        fetch("/api/admin_api/coins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(async (res) => {
          const contentType = res.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();

            if (!res.ok) {
              if (data.details) {
                data.details.forEach(
                  (err: { field: string; message: string }) => {
                    toast.error(`${err.field}: ${err.message}`);
                  }
                );
              }

              throw new Error(data.error || "Coin creation failed");
            }

            return data;
          } else {
            const text = await res.text();
            console.error("Unexpected response:", text);
            throw new Error("Server returned non-JSON data");
          }
        }),
        {
          loading: "Saving coin...",
          success: "Coin saved successfully!",
          error: (err) => err.message || "Failed to save coin",
        }
      );

      router.push("/admin/spotcoin/coinlist");
    } catch (err) {
      console.error("Coin creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Create Coins</h2>

      <input
        type="text"
        name="coinName"
        placeholder="Coin Name (e.g. BTC, XRP)"
        value={form.coinName}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        name="coinTitle"
        placeholder="Coin Title (e.g. bitcoin, ripple)"
        value={form.coinTitle}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        step="0.001"
        name="coinRate"
        placeholder="Coin Rate (USD)"
        value={form.coinRate}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        name="photo"
        placeholder="Photo URL"
        value={form.photo}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        name="withMin"
        placeholder="Withdraw Min"
        value={form.withMin}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        name="withMax"
        placeholder="Withdraw Max"
        value={form.withMax}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        name="depositAddress"
        placeholder="Deposit Address"
        value={form.depositAddress}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        name="percent"
        min="1"
        max="10"
        placeholder="Transaction Fee (%)"
        value={form.percent}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <textarea
        name="withInstructions"
        placeholder="Withdraw Instructions"
        value={form.withInstructions}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <textarea
        name="depositInstructions"
        placeholder="Deposit Instructions"
        value={form.depositInstructions}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <textarea
        name="desc"
        placeholder="Description"
        value={form.desc}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <select
        name="coinVisible"
        value={form.coinVisible}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="true">Visible</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className={`${
          loading
            ? " bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } cursor-pointer text-white px-4 py-2 rounded`}
      >
        {loading ? "Saving..." : "Save Coin"}
      </button>
    </form>
  );
}
