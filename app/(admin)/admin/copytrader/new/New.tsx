"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NewTrader() {
  const [form, setForm] = useState({
    name: "",
    photo: "",
    noTrades: "",
    noCopiers: "",
    status: "",
    noWins: "",
    rank: "",
    strategyDesc: "",
    noLoss: "",
    profit: "",
    loss: "",
    edate: "",
    commission: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    const res = await toast.promise(
      fetch("/api/admin_api/copytraders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
      {
        loading: "Creating...",
        success: "Created successfully",
        error: "Failed to create",
      }
    );

    setLoading(false);
    if (res.ok) router.push("/admin/copytrader");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">New CopyTrader</h2>

      <label htmlFor="name">
        Name <span className="text-red-600 text-sm">(max: 100)</span>
      </label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        maxLength={100}
        className="w-full border p-2 rounded"
      />

      <label htmlFor="photo">
        Photo URL <span className="text-red-600 text-sm">(max: 255)</span>
      </label>
      <input
        name="photo"
        value={form.photo}
        onChange={handleChange}
        maxLength={255}
        className="w-full border p-2 rounded"
      />

      <label htmlFor="noTrades">
        No. of Trades <span className="text-red-600 text-sm">(max: 50)</span>
      </label>
      <input
        name="noTrades"
        value={form.noTrades}
        onChange={handleChange}
        maxLength={50}
        className="w-full border p-2 rounded"
      />

      <label htmlFor="noCopiers">
        No. of Copiers <span className="text-red-600 text-sm">(max: 50)</span>
      </label>
      <input
        name="noCopiers"
        value={form.noCopiers}
        onChange={handleChange}
        maxLength={50}
        className="w-full border p-2 rounded"
      />

      <label htmlFor="status">
        Status <span className="text-red-600 text-sm">(max: 20)</span>
      </label>
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <label htmlFor="noWins">
        No. of Wins <span className="text-red-600 text-sm">(max: 50)</span>
      </label>
      <input
        name="noWins"
        value={form.noWins}
        onChange={handleChange}
        maxLength={50}
        className="w-full border p-2 rounded"
      />

      <label htmlFor="rank">
        Rank <span className="text-red-600 text-sm">(max: 50)</span>
      </label>
      <select
        name="rank"
        value={form.rank}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="Excellent">Excellent</option>
        <option value="Pro">Pro</option>
        <option value="High achiever">High achiever</option>
        <option value="Top trader">Top trader</option>
        <option value="Expert">Expert</option>
      </select>

      <label htmlFor="strategyDesc">
        Strategy Description{" "}
        <span className="text-red-600 text-sm">(max: 1000)</span>
      </label>
      <textarea
        name="strategyDesc"
        value={form.strategyDesc}
        onChange={handleChange}
        maxLength={1000}
        className="w-full border p-2 rounded"
        rows={4}
      />

      <label htmlFor="noLoss">
        No. of Losses <span className="text-red-600 text-sm">(max: 50)</span>
      </label>
      <input
        name="noLoss"
        value={form.noLoss}
        onChange={handleChange}
        maxLength={50}
        className="w-full border p-2 rounded"
      />

      <label htmlFor="profit">
        Profit <span className="text-red-600 text-sm">(max: 50)</span>
      </label>
      <input
        name="profit"
        value={form.profit}
        onChange={handleChange}
        maxLength={50}
        className="w-full border p-2 rounded"
      />

      <label htmlFor="loss">
        Loss <span className="text-red-600 text-sm">(max: 50)</span>
      </label>
      <input
        name="loss"
        value={form.loss}
        onChange={handleChange}
        maxLength={50}
        className="w-full border p-2 rounded"
      />

      <label htmlFor="edate">
        End Date <span className="text-red-600 text-sm">(max: 50)</span>
      </label>
      <input
        name="edate"
        value={form.edate}
        onChange={handleChange}
        maxLength={50}
        className="w-full border p-2 rounded"
      />

      <label htmlFor="commission">
        Commission <span className="text-red-600 text-sm">(max: 10)</span>
      </label>
      <input
        name="commission"
        value={form.commission}
        onChange={handleChange}
        maxLength={10}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } cursor-pointer text-white px-4 py-2 rounded`}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
