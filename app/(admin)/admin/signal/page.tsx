"use client";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { debounce } from "lodash";

interface Signal {
  id: number;
  name: string;
  price: string;
  strength: string;
}

export default function SignalList() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin_api/signals");
      if (!res.ok) throw new Error("Failed to fetch signals");
      const data = await res.json();
      setSignals(data);
    } catch (error) {
      toast.error("Failed to fetch signals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value: string) => setSearch(value), 300),
    []
  );

  const filtered = search
    ? signals.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : signals;

  const handleDelete = async (id: number) => {
    if (!confirm("Delete signal?")) return;
    await toast.promise(
      fetch(`/api/admin_api/signals/${id}`, { method: "DELETE" }),
      {
        loading: "Deleting...",
        success: "Deleted signal!",
        error: "Delete failed",
      }
    );
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Signals</h1>
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <Link href="/admin/signal/new">
          <button className="cursor-pointer bg-blue-600 px-4 py-2 text-white rounded">
            + New Signal
          </button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="text-center bg-gray-300">
              <th>Name</th>
              <th>Price</th>
              <th>Strength</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((signal) => (
              <tr key={signal.id} className="hover:bg-gray-50 text-center">
                <td className="p-2 border">{signal.name}</td>
                <td className="p-2 border">{signal.price}</td>
                <td className="p-2 border">{signal.strength}</td>
                <td className="p-2 border space-x-2">
                  <Link href={`/admin/signal/${signal.id}`}>
                    <button className="cursor-pointer text-blue-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(signal.id)}
                    className="cursor-pointer text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
