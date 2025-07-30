"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditTraders({ params }: { params: { id: string } }) {
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
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/admin_api/copytraders/${params.id}`);
        if (!res.ok) {
          toast.error("Failed to load trader data");
          setFetching(false);
          return;
        }
        const data = await res.json();
        setForm(data);
      } catch {
        toast.error("Unexpected error");
      } finally {
        setFetching(false);
      }
    }
    fetchData();
  }, [params.id]);

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
      fetch(`/api/admin_api/copytraders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
      {
        loading: "Updating...",
        success: "Updated successfully",
        error: "Failed to update",
      }
    );

    setLoading(false);
    if (res.ok) router.push("/admin/copytrader");
  };

  if (fetching) return <p className="p-6">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-4">Edit CopyTrader</h2>

      <div>
        <label htmlFor="name">
          Name <span className="text-red-500 text-xs">(max 100)</span>
        </label>
        <input
          id="name"
          name="name"
          maxLength={100}
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="photo">
          Photo URL <span className="text-red-500 text-xs">(max 255)</span>
        </label>
        <input
          id="photo"
          name="photo"
          maxLength={255}
          value={form.photo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="noTrades">
          No. of Trades <span className="text-red-500 text-xs">(max 50)</span>
        </label>
        <input
          id="noTrades"
          name="noTrades"
          maxLength={50}
          value={form.noTrades}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="noCopiers">
          No. of Copiers <span className="text-red-500 text-xs">(max 50)</span>
        </label>
        <input
          id="noCopiers"
          name="noCopiers"
          maxLength={50}
          value={form.noCopiers}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="status">
          Status <span className="text-red-500 text-xs">(max 20)</span>
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select Status --</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label htmlFor="noWins">
          No. of Wins <span className="text-red-500 text-xs">(max 50)</span>
        </label>
        <input
          id="noWins"
          name="noWins"
          maxLength={50}
          value={form.noWins}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="rank">
          Rank <span className="text-red-500 text-xs">(max 50)</span>
        </label>
        <select
          id="rank"
          name="rank"
          value={form.rank}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select Rank --</option>
          <option value="Excellent">Excellent</option>
          <option value="Pro">Pro</option>
          <option value="High achiever">High achiever</option>
          <option value="Top trader">Top trader</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      <div>
        <label htmlFor="strategyDesc">
          Strategy Description{" "}
          <span className="text-red-500 text-xs">(max 1000)</span>
        </label>
        <textarea
          id="strategyDesc"
          name="strategyDesc"
          maxLength={1000}
          value={form.strategyDesc}
          onChange={handleChange}
          rows={3}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="noLoss">
          No. of Losses <span className="text-red-500 text-xs">(max 50)</span>
        </label>
        <input
          id="noLoss"
          name="noLoss"
          maxLength={50}
          value={form.noLoss}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="profit">
          Profit <span className="text-red-500 text-xs">(max 50)</span>
        </label>
        <input
          id="profit"
          name="profit"
          maxLength={50}
          value={form.profit}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="loss">
          Loss <span className="text-red-500 text-xs">(max 50)</span>
        </label>
        <input
          id="loss"
          name="loss"
          maxLength={50}
          value={form.loss}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="edate">
          End Date <span className="text-red-500 text-xs">(max 50)</span>
        </label>
        <input
          id="edate"
          name="edate"
          maxLength={50}
          value={form.edate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="commission">
          Commission <span className="text-red-500 text-xs">(max 10)</span>
        </label>
        <input
          id="commission"
          name="commission"
          maxLength={10}
          value={form.commission}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } cursor-pointer text-white px-4 py-2 rounded`}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
