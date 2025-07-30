"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ViewCoinsPage() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/admin_api/coins/coinlist");
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Failed to fetch coins", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const deleteCoin = async (coinId: number) => {
    if (!confirm("Are you sure you want to delete this coin?")) return;

    try {
      const res = await fetch(`/api/admin_api/coins/${coinId}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete coin");
      }

      // Update the coins state by filtering out the deleted coin
      setCoins(coins.filter((coin: any) => coin.id !== coinId));
      alert("Coin deleted successfully");
    } catch (error) {
      console.error("Error deleting coin:", error);
      alert(
        `Failed to delete coin: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const filteredCoins = coins.filter(
    (coin: any) =>
      coin.coinName.toLowerCase().includes(search.toLowerCase()) ||
      coin.coinTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">All Coins</h1>

        <span className="bg-amber-300 py-2 px-4 rounded text-black font-semibold">
          <Link href="/admin/spotcoin/newcoins">NEW COIN +</Link>
        </span>
      </div>

      <input
        type="text"
        placeholder="Search coin by name or title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/3 mb-4 p-2 border rounded"
      />

      {loading ? (
        <p>Loading coins...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border dark:bg-gray-900 dark:text-white text-center">
            <thead>
              <tr>
                <th className="border px-4 py-2">Photo</th>
                <th className="border px-4 py-2">Coin</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Rate (USD)</th>
                <th className="border px-4 py-2">Visible</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    No coins found.
                  </td>
                </tr>
              ) : (
                filteredCoins.map((coin: any) => (
                  <tr key={coin.id}>
                    <td className="border px-4 py-2">
                      {coin.photo ? (
                        <img
                          src={coin.photo}
                          alt={coin.coinName}
                          className="h-6 w-6 object-contain"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="border px-4 py-2 font-bold">
                      {coin.coinName}
                    </td>
                    <td className="border px-4 py-2">{coin.coinTitle}</td>
                    <td className="border px-4 py-2">
                      ${Number(coin.coinRate).toFixed(3)}
                    </td>
                    <td className="border px-4 py-2">
                      {coin.coinVisible ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-600 font-medium">No</span>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      <Link
                        href={`/admin/spotcoin/editcoin/${coin.id}`}
                        className="cursor-pointer text-blue-600 hover:underline mr-2"
                      >
                        <button className="cursor-pointer text-blue-600 hover:underline mr-2">
                          Edit
                        </button>
                      </Link>
                      <button
                        className="cursor-pointer text-red-600 hover:underline"
                        onClick={() => deleteCoin(coin.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
