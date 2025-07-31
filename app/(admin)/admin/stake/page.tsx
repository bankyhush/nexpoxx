"use client";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { debounce } from "lodash";

interface Staking {
  id: number;
  name: string;
  title: string;
  photo: string;
  duration: string;
  roi: string;
  min: string;
  max: string;
}

export default function StakingList() {
  const [stakingRecords, setStakingRecords] = useState<Staking[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin_api/stakes");
      if (!res.ok) throw new Error("Failed to fetch staking records");
      const data = await res.json();
      setStakingRecords(data);
    } catch (error) {
      toast.error("Failed to fetch staking records.");
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
    ? stakingRecords.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
    : stakingRecords;

  const handleDelete = async (id: number) => {
    if (!confirm("Delete staking record?")) return;
    await toast.promise(
      fetch(`/api/admin_api/stakes/${id}`, { method: "DELETE" }),
      {
        loading: "Deleting...",
        success: "Deleted staking record!",
        error: "Delete failed",
      }
    );
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staking Records</h1>
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search by name..."
          onChange={(e) => handleSearch(e.target.value)}
          className="border p-2 rounded"
          aria-label="Search staking records"
        />
        <Link href="/admin/stake/new">
          <button className="cursor-pointer bg-blue-600 px-4 py-2 text-white rounded">
            + New Staking
          </button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="text-center bg-gray-300">
              <th>Avatar</th>
              <th>Name</th>
              <th>Title</th>
              <th>Duration</th>
              <th>ROI</th>
              <th>Min</th>
              <th>Max</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((staking) => (
              <tr key={staking.id} className="hover:bg-gray-50 text-center">
                <td className="p-2 border">
                  <img src={staking.photo} className="w-8 h-8" />
                </td>
                <td className="p-2 border">{staking.name}</td>
                <td className="p-2 border">{staking.title}</td>
                <td className="p-2 border">{staking.duration}</td>
                <td className="p-2 border">{staking.roi}</td>
                <td className="p-2 border">{staking.min}</td>
                <td className="p-2 border">{staking.max}</td>
                <td className="p-2 border space-x-2">
                  <Link href={`/admin/stake/${staking.id}`}>
                    <button className="cursor-pointer text-blue-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(staking.id)}
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
