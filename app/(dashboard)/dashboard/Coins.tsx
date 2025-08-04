"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface Asset {
  id: string;
  name: string;
  fullName: string;
  holdings: string;
  holdingsUsd: string;
  spotPrice: string;
  priceChange: string;
  photo: string | null;
}

export default function DashboardCoins() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [hideSmallAssets, setHideSmallAssets] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard_api/listcoins");
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.details?.map((d: any) => d.message).join(", ") ||
              "Failed to load assets"
          );
        }
        const data = await res.json();
        setAssets(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filteredAssets = assets
    .filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (asset) => !hideSmallAssets || Number(asset.holdings) >= 0.00000001
    );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto">
        <div className="p-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="relative w-full sm:w-80">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-2"></div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-sm text-gray-500 border-t border-b border-gray-200">
                <th className="text-left px-6 py-3 font-medium">Name</th>
                <th className="text-right px-6 py-3 font-medium">Holdings</th>
                <th className="text-right px-6 py-3 font-medium">Spot Price</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="ml-3">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  //   if (!filteredAssets.length) {
  //     return (
  //       <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto text-center text-gray-500">
  //         No assets found
  //       </div>
  //     );
  //   }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Assets</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="relative w-full sm:w-auto">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assets"
              className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              aria-label="Search assets"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hideSmall"
              checked={hideSmallAssets}
              onChange={(e) => setHideSmallAssets(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-0 cursor-pointer"
            />
            <label
              htmlFor="hideSmall"
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              Hide small assets
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredAssets.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No results found <br />
            Try changing your filter or search
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="text-sm text-gray-500 border-t border-b border-gray-200">
                <th className="text-left px-6 py-3 font-medium">Name</th>
                <th className="text-right px-6 py-3 font-medium">Holdings</th>
                <th className="text-right px-6 py-3 font-medium">Spot Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                  onClick={() => router.push(`/dashboard/overview/${asset.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: asset.photo
                            ? "transparent"
                            : "#23292F",
                          color: asset.photo ? "inherit" : "white",
                        }}
                      >
                        {asset.photo ? (
                          <img
                            src={asset.photo}
                            alt={`${asset.name} logo`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          asset.name.charAt(0)
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-gray-500">
                          {asset.fullName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium">{asset.holdings}</div>
                    <div className="text-sm text-gray-500">
                      {asset.holdingsUsd}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-yellow-700">
                      {asset.spotPrice}
                    </div>
                    <div className="text-sm text-gray-500">
                      {asset.priceChange}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
