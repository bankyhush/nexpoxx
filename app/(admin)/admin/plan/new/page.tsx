"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewPlanPage() {
  const [form, setForm] = useState({
    plan_name: "",
    plan_des: "",
    min_ins: "",
    max_ins: "",
    days_duration: "",
    daily_interest: "",
    status: "Active",
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
      fetch("/api/admin_api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
      {
        loading: "Creating...",
        success: "Plan Created!",
        error: "Failed to create plan",
      }
    );

    setLoading(false);
    if (res.ok) router.push("/admin/plan");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-4">New Plan</h2>

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

      <label>Description</label>
      <textarea
        name="plan_des"
        value={form.plan_des}
        onChange={handleChange}
        rows={4}
        required
        className="w-full border p-2 rounded"
      />

      <label>Min Invest (max 100)</label>
      <input
        name="min_ins"
        value={form.min_ins}
        onChange={handleChange}
        maxLength={100}
        required
        className="w-full border p-2 rounded"
      />

      <label>Max Invest (max 100)</label>
      <input
        name="max_ins"
        value={form.max_ins}
        onChange={handleChange}
        maxLength={100}
        required
        className="w-full border p-2 rounded"
      />

      <label>Days Duration (max 100)</label>
      <input
        name="days_duration"
        value={form.days_duration}
        onChange={handleChange}
        maxLength={100}
        required
        className="w-full border p-2 rounded"
      />

      <label>Daily ROI (max 100)</label>
      <input
        name="daily_interest"
        value={form.daily_interest}
        onChange={handleChange}
        maxLength={100}
        required
        className="w-full border p-2 rounded"
      />

      <label>
        Status <span className="text-red-500">(max 10)</span>
      </label>
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      >
        <option value="inactive">Inactive</option>
        <option value="active">Active</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } cursor-pointer text-white px-4 py-2 rounded`}
      >
        {loading ? "Creating..." : "Create Plan"}
      </button>
    </form>
  );
}
