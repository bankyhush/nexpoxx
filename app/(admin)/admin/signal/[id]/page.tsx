"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditSignalPage() {
  const params = useParams();
  const id = params.id;
  const [form, setForm] = useState({
    name: "",
    price: "",
    strength: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSignal() {
      try {
        const res = await fetch(`/api/admin_api/signals/${id}`);
        if (!res.ok) throw new Error("Failed to fetch signal");
        const data = await res.json();
        setForm(data);
      } catch {
        toast.error("Failed to load signal data");
      } finally {
        setFetching(false);
      }
    }
    fetchSignal();
  }, [id]);

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
      fetch(`/api/admin_api/signals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }),
      {
        loading: "Updating...",
        success: "Signal Updated!",
        error: "Failed to update signal",
      }
    );

    setLoading(false);
    if (res.ok) router.push("/admin/signal");
  };

  if (fetching) return <p className="p-6">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-4">Edit Signal</h2>

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
        className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Signal"}
      </button>
    </form>
  );
}
