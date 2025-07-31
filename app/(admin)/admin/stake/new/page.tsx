"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewStakingPage() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    photo: "",
    duration: "",
    roi: "",
    min: "",
    max: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    const res = await toast.promise(
      fetch("/api/admin_api/stakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
      {
        loading: "Creating...",
        success: "Staking Created!",
        error: "Failed to create staking",
      }
    );

    setLoading(false);
    if (res.ok) router.push("/admin/stake");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-4">New Staking</h2>

      <label>
        Name <span className="text-red-500">(max 100)</span>
      </label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        maxLength={100}
        required
        className="w-full border p-2 rounded"
        aria-label="Staking name"
      />

      <label>
        Title <span className="text-red-500">(max 100)</span>
      </label>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        maxLength={100}
        required
        className="w-full border p-2 rounded"
        aria-label="Staking title"
      />

      <label>
        Photo URL <span className="text-red-500">(max 255)</span>
      </label>
      <input
        name="photo"
        value={form.photo}
        onChange={handleChange}
        maxLength={255}
        required
        className="w-full border p-2 rounded"
        aria-label="Photo URL"
      />

      <label>
        Duration <span className="text-red-500">(max 50)</span>
      </label>
      <input
        name="duration"
        value={form.duration}
        onChange={handleChange}
        maxLength={50}
        required
        className="w-full border p-2 rounded"
        aria-label="Staking duration"
      />

      <label>
        ROI (%) <span className="text-red-500">(max 50)</span>
      </label>
      <input
        name="roi"
        value={form.roi}
        onChange={handleChange}
        maxLength={50}
        required
        className="w-full border p-2 rounded"
        aria-label="Return on investment"
      />

      <label>
        Minimum Amount <span className="text-red-500">(max 50)</span>
      </label>
      <input
        name="min"
        value={form.min}
        onChange={handleChange}
        maxLength={50}
        required
        className="w-full border p-2 rounded"
        aria-label="Minimum staking amount"
      />

      <label>
        Maximum Amount <span className="text-red-500">(max 50)</span>
      </label>
      <input
        name="max"
        value={form.max}
        onChange={handleChange}
        maxLength={50}
        required
        className="w-full border p-2 rounded"
        aria-label="Maximum staking amount"
      />

      <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } cursor-pointer text-white px-4 py-2 rounded`}
      >
        {loading ? "Creating..." : "Create Staking"}
      </button>
    </form>
  );
}
