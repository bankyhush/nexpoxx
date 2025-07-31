"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Plan {
  id: number;
  plan_name: string;
  status: string;
}

export default function PlanList() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin_api/plans");
    setPlans(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = search
    ? plans.filter((p) =>
        p.plan_name.toLowerCase().includes(search.toLowerCase())
      )
    : plans;

  const handleDelete = async (id: number) => {
    if (!confirm("Delete plan?")) return;
    await toast.promise(
      fetch(`/api/admin_api/plans/${id}`, { method: "DELETE" }),
      {
        loading: "Deleting...",
        success: "Deleted plan!",
        error: "Delete failed",
      }
    );
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Plans</h1>
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <Link href="/admin/plan/new">
          <button className="cursor-pointer bg-blue-600 px-4 py-2 text-white rounded">
            + New Plan
          </button>
        </Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((plan) => (
            <tr key={plan.id} className="hover:bg-gray-50">
              <td className="p-2 border">{plan.plan_name}</td>
              <td className="p-2 border">{plan.status}</td>
              <td className="p-2 border space-x-2">
                <Link href={`/admin/plan/${plan.id}/edit`}>
                  <button className="text-blue-600">Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
