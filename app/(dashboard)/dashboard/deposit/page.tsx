"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Copy, QrCode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  color: string;
}

interface Network {
  id: string;
  name: string;
  description?: string;
}

const DepositDashboard = () => {
  // State for dropdown visibility
  const [coinDropdownOpen, setCoinDropdownOpen] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  // State for selected values
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>({
    id: "usdt",
    symbol: "USDT",
    name: "Tether",
    icon: "T",
    color: "from-teal-400 to-teal-600",
  });

  const [selectedNetwork, setSelectedNetwork] = useState<Network>({
    id: "erc20",
    name: "USDT Usdt-Erc-20",
  });

  const [walletAddress] = useState(
    "0xA44c39Ba39E95087d5d6e73cb45C14e1B7B4725f"
  );
  const [copySuccess, setCopySuccess] = useState(false);

  // Refs for dropdown elements
  const coinDropdownRef = useRef<HTMLDivElement>(null);
  const networkDropdownRef = useRef<HTMLDivElement>(null);

  // Sample data for cryptocurrencies
  const coins: CryptoCoin[] = [
    {
      id: "usdt",
      symbol: "USDT",
      name: "Tether",
      icon: "T",
      color: "from-teal-400 to-teal-600",
    },
    {
      id: "btc",
      symbol: "BTC",
      name: "Bitcoin",
      icon: "B",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: "eth",
      symbol: "ETH",
      name: "Ethereum",
      icon: "E",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "sol",
      symbol: "SOL",
      name: "Solana",
      icon: "S",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "xrp",
      symbol: "XRP",
      name: "Ripple",
      icon: "X",
      color: "from-gray-400 to-gray-600",
    },
  ];

  // Networks for USDT
  const usdtNetworks: Network[] = [
    { id: "erc20", name: "USDT Usdt-Erc-20" },
    { id: "trc20", name: "USDT Usdt-Trc-20" },
    { id: "bep20", name: "USDT Usdt-Bep-20 (BSC)" },
    { id: "solana", name: "USDT Usdt-SPL" },
    { id: "polygon", name: "USDT Usdt-Polygon" },
  ];

  // Networks for BTC
  const btcNetworks: Network[] = [
    { id: "btc", name: "BTC Bitcoin" },
    { id: "lightning", name: "BTC Lightning Network" },
  ];

  // Networks for ETH
  const ethNetworks: Network[] = [
    { id: "eth", name: "ETH Ethereum" },
    { id: "arbitrum", name: "ETH Arbitrum" },
    { id: "optimism", name: "ETH Optimism" },
  ];

  // Get networks based on selected coin
  const getNetworksForCoin = (coinId: string): Network[] => {
    switch (coinId) {
      case "usdt":
        return usdtNetworks;
      case "btc":
        return btcNetworks;
      case "eth":
        return ethNetworks;
      default:
        return [{ id: "default", name: "Default Network" }];
    }
  };

  const networks = getNetworksForCoin(selectedCoin.id);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        coinDropdownRef.current &&
        !coinDropdownRef.current.contains(event.target as Node)
      ) {
        setCoinDropdownOpen(false);
      }
      if (
        networkDropdownRef.current &&
        !networkDropdownRef.current.contains(event.target as Node)
      ) {
        setNetworkDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle coin selection
  const handleCoinSelect = (coin: CryptoCoin) => {
    setSelectedCoin(coin);
    setCoinDropdownOpen(false);

    // Reset network selection to first available network for the selected coin
    const availableNetworks = getNetworksForCoin(coin.id);
    if (availableNetworks.length > 0) {
      setSelectedNetwork(availableNetworks[0]);
    }
  };

  // Handle network selection
  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network);
    setNetworkDropdownOpen(false);
  };

  // Handle copy address
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen mb-20 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Deposit Form */}
          <div className="lg:col-span-2 bg-[#1a1a1a] rounded-lg p-6">
            <div className="space-y-6">
              {/* Select Coin */}
              <div ref={coinDropdownRef} className="relative">
                <label className="block text-white mb-2">Select Coin</label>
                <button
                  className="w-full flex items-center justify-between bg-[#0a0a0a] border border-[#333] rounded-md p-3 text-white"
                  onClick={() => setCoinDropdownOpen(!coinDropdownOpen)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 relative">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${selectedCoin.color} rounded-full`}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                        {selectedCoin.icon}
                      </div>
                    </div>
                    <span>{selectedCoin.symbol}</span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>

                {coinDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-[#0a0a0a] border border-[#333] rounded-md shadow-lg max-h-60 overflow-auto">
                    {coins.map((coin) => (
                      <div
                        key={coin.id}
                        className="flex items-center p-3 hover:bg-[#222] cursor-pointer"
                        onClick={() => handleCoinSelect(coin)}
                      >
                        <div className="w-8 h-8 mr-2 relative">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${coin.color} rounded-full`}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                            {coin.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{coin.symbol}</div>
                          <div className="text-sm text-gray-400">
                            {coin.name}
                          </div>
                        </div>
                        {selectedCoin.id === coin.id && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Network */}
              <div ref={networkDropdownRef} className="relative">
                <label className="block text-white mb-2">Network</label>
                <button
                  className="w-full flex items-center justify-between bg-[#0a0a0a] border border-[#333] rounded-md p-3 text-white"
                  onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
                >
                  <span>{selectedNetwork.name}</span>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>

                {networkDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-[#0a0a0a] border border-[#333] rounded-md shadow-lg max-h-60 overflow-auto">
                    {networks.map((network) => (
                      <div
                        key={network.id}
                        className="p-3 hover:bg-[#222] cursor-pointer"
                        onClick={() => handleNetworkSelect(network)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{network.name}</span>
                          {selectedNetwork.id === network.id && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        {network.description && (
                          <p className="text-sm text-gray-400 mt-1">
                            {network.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-gray-400 text-sm mt-2">
                  Make sure the network you choose for the deposit matches the
                  withdrawal network or your assets may be lost.
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-white mb-2">Address</label>
                <div className="relative">
                  <div className="flex">
                    <input
                      type="text"
                      value={walletAddress}
                      readOnly
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-l-md p-3 text-white"
                    />
                    <div className="flex">
                      <button
                        onClick={handleCopyAddress}
                        className="bg-[#0a0a0a] border border-l-0 border-[#333] p-3 hover:bg-[#222] relative"
                      >
                        {copySuccess ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-400" />
                        )}
                        {copySuccess && (
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Copied!
                          </div>
                        )}
                      </button>
                      <button className="bg-[#0a0a0a] border border-l-0 border-[#333] rounded-r-md p-3 hover:bg-[#222]">
                        <QrCode className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expected Arrival & Coin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white mb-2">
                    Expected Arrival
                  </label>
                  <p className="text-white">1 network confirmation/s</p>
                </div>
                <div>
                  <label className="block text-white mb-2">Coin</label>
                  <p className="text-white">Only send {selectedCoin.symbol}</p>
                </div>
              </div>

              {/* Network Warning */}
              <div>
                <label className="block text-white mb-2">Network</label>
                <p className="text-white">
                  Make sure the network is {selectedNetwork.name}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Help & Support */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <div className="space-y-6">
              <h2 className="text-sm font-medium border-b border-[#333] pb-4">
                Facing Deposit Issues?
              </h2>

              <div className="space-y-4 text-sm">
                <p className="text-gray-300">
                  If you experience challenges during your deposit process,
                  consider the following:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>
                    Ensure the correct Deposit Status Inquiry to check on your
                    deposit status.
                  </li>
                  <li>Verify that the correct MEMO/Label was entered.</li>
                  <li>
                    Check that you haven&apos;t deposited any unlisted coins.
                  </li>
                </ul>
              </div>

              <div className="space-y-4 text-sm">
                <h3 className="text-sm font-medium">
                  Need Further Assistance?
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Contact our Support Team.</li>
                  <li>
                    Familiarize yourself with common issues related to
                    cryptocurrencies deposited with incorrect or missing
                    information.
                  </li>
                  <li>Learn more about purchasing cryptocurrencies.</li>
                </ul>
              </div>

              <div className="mt-8">
                <Button className="w-full bg-[#333] hover:bg-[#444] text-white border-none">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositDashboard;
