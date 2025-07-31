"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewSignalPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    strength: "",
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
      fetch("/api/admin_api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
      {
        loading: "Creating...",
        success: "Signal Created!",
        error: "Failed to create signal",
      }
    );

    setLoading(false);
    if (res.ok) router.push("/admin/signal");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-4">New Signal</h2>

      <label>
        Signal Name <span className="text-red-500">(max 100)</span>
      </label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        maxLength={100}
        required
        className="w-full border p-2 rounded"
      />

      <label>
        Price <span className="text-red-500">(max 50)</span>
      </label>
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        maxLength={50}
        required
        className="w-full border p-2 rounded"
      />

      <label>
        Strength <span className="text-red-500">(max 50)</span>
      </label>
      <input
        name="strength"
        value={form.strength}
        onChange={handleChange}
        maxLength={50}
        required
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } cursor-pointer text-white px-4 py-2 rounded`}
      >
        {loading ? "Creating..." : "Create Signal"}
      </button>
    </form>
  );
}
