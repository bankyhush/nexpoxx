"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

interface CopyTrader {
  id: number;
  name: string;
  photo?: string;
  profit: string;
  loss: string;
  rank: string;
}

export default function TraderList() {
  const [list, setList] = useState<CopyTrader[]>([]);
  const [search, setSearch] = useState("");

  const fetchList = async () => {
    const res = await fetch("/api/admin_api/copytraders");
    setList(await res.json());
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trader?")) return;
    await toast.promise(
      fetch(`/api/admin_api/copytraders/${id}`, { method: "DELETE" }),
      {
        loading: "Deleting...",
        success: "Deleted!",
        error: "Delete failed",
      }
    );
    fetchList();
  };

  const filtered = search
    ? list.filter((ct) => ct.name.toLowerCase().includes(search.toLowerCase()))
    : list;

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0" : `$${num.toFixed(2)}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CopyTrader List</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          className="border p-2 rounded w-64"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link href="/admin/copytrader/new">
          <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
            + New
          </button>
        </Link>
      </div>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left">Photo</th>
            <th className="p-2 border text-left">Name</th>
            <th className="p-2 border text-left">Profit</th>
            <th className="p-2 border text-left">Rank</th>
            <th className="p-2 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((ct) => {
            const profit = parseFloat(ct.profit) || 0;
            const loss = parseFloat(ct.loss) || 0;
            const gain = profit - loss;

            return (
              <tr key={ct.id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {ct.photo ? (
                    <img
                      src={ct.photo}
                      alt={ct.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  )}
                </td>
                <td className="p-2 border">{ct.name}</td>
                <td className="p-2 border text-green-600">{ct.profit}</td>
                <td
                  className={`p-2 border ${
                    gain >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {ct.rank}
                </td>
                <td className="p-2 border space-x-2">
                  <Link href={`/admin/copytrader/${ct.id}/edit`}>
                    <button className="cursor-pointer text-blue-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    className="cursor-pointer text-red-600"
                    onClick={() => handleDelete(ct.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
