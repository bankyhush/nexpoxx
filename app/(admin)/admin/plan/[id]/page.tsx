"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditPlanPage() {
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState({
    plan_name: "",
    plan_des: "",
    min_ins: "",
    max_ins: "",
    days_duration: "",
    daily_interest_rate: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch(`/api/admin_api/plans/${id}`);
        if (!res.ok) throw new Error("Failed to fetch plan");
        const data = await res.json();
        setForm(data);
      } catch {
        toast.error("Failed to load plan data");
      } finally {
        setFetching(false);
      }
    }

    fetchPlan();
  }, [id]);

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
      fetch(`/api/admin_api/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
      {
        loading: "Updating...",
        success: "Plan Updated!",
        error: "Failed to update plan",
      }
    );

    setLoading(false);
    if (res.ok) router.push("/admin/plan");
  };

  if (fetching) return <p className="p-6">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-4">Edit Plan</h2>

      <label>
        Plan Name <span className="text-red-500">(max 100)</span>
      </label>
      <input
        name="plan_name"
        value={form.plan_name}
        onChange={handleChange}
        maxLength={100}
        required
        className="w-full border p-2 rounded"
      />

      <label>Plan Description</label>
      <textarea
        name="plan_des"
        value={form.plan_des}
        onChange={handleChange}
        rows={4}
        className="w-full border p-2 rounded"
      />

      <label>Minimum Investment</label>
      <input
        type="number"
        name="min_ins"
        value={form.min_ins}
        onChange={handleChange}
        required
        min={0}
        className="w-full border p-2 rounded"
      />

      <label>Maximum Investment</label>
      <input
        type="number"
        name="max_ins"
        value={form.max_ins}
        onChange={handleChange}
        required
        min={0}
        className="w-full border p-2 rounded"
      />

      <label>Days Duration</label>
      <input
        type="number"
        name="days_duration"
        value={form.days_duration}
        onChange={handleChange}
        required
        min={1}
        className="w-full border p-2 rounded"
      />

      <label>Daily Interest Rate (%)</label>
      <input
        type="number"
        step="0.01"
        name="daily_interest_rate"
        value={form.daily_interest_rate}
        onChange={handleChange}
        required
        min={0}
        className="w-full border p-2 rounded"
      />

      <label>Status</label>
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Plan"}
      </button>
    </form>
  );
}
