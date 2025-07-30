"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronRight, Circle, Copy, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CryptoCoin {
  id: string
  symbol: string
  name: string
  icon: string
  color: string
}

interface Network {
  id: string
  name: string
  icon: string
  color: string
}

interface WithdrawalAddress {
  id: string
  label: string
  address: string
  network: string
}

interface WithdrawalHistory {
  id: string
  time: string
  reference: string
  address: string
  addressShort: string
  network: string
  txid: string
  txidShort: string
  crypto: string
  amount: number
  fee: number
  status: string
}

const WithdrawalPage = () => {
  // State for dropdown visibility
  const [coinDropdownOpen, setCoinDropdownOpen] = useState(false)
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false)
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false)

  // State for selected values
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>({
    id: "usdt",
    symbol: "USDT",
    name: "Tether",
    icon: "T",
    color: "bg-teal-500",
  })

  const [selectedNetwork, setSelectedNetwork] = useState<Network>({
    id: "optimism",
    name: "Optimism",
    icon: "OP",
    color: "bg-red-500",
  })

  const [selectedAddress, setSelectedAddress] = useState<WithdrawalAddress | null>(null)
  const [customAddress, setCustomAddress] = useState("")
  const [withdrawalType, setWithdrawalType] = useState("on-chain")
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [activeTab, setActiveTab] = useState("usdt")

  // Refs for dropdown elements
  const coinDropdownRef = useRef<HTMLDivElement>(null)
  const networkDropdownRef = useRef<HTMLDivElement>(null)
  const addressDropdownRef = useRef<HTMLDivElement>(null)

  // Sample data for cryptocurrencies
  const coins: CryptoCoin[] = [
    { id: "usdt", symbol: "USDT", name: "Tether", icon: "T", color: "bg-teal-500" },
    { id: "btc", symbol: "BTC", name: "Bitcoin", icon: "₿", color: "bg-orange-500" },
    { id: "eth", symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "bg-purple-500" },
    { id: "sol", symbol: "SOL", name: "Solana", icon: "S", color: "bg-blue-500" },
    { id: "xrp", symbol: "XRP", name: "Ripple", icon: "X", color: "bg-gray-500" },
  ]

  // Networks for USDT
  const usdtNetworks: Network[] = [
    { id: "optimism", name: "Optimism", icon: "OP", color: "bg-red-500" },
    { id: "ethereum", name: "Ethereum", icon: "ETH", color: "bg-purple-500" },
    { id: "tron", name: "Tron", icon: "TRX", color: "bg-red-600" },
    { id: "bsc", name: "BNB Smart Chain", icon: "BSC", color: "bg-yellow-500" },
    { id: "polygon", name: "Polygon", icon: "MATIC", color: "bg-purple-600" },
  ]

  // Get networks based on selected coin
  const getNetworksForCoin = (coinId: string): Network[] => {
    switch (coinId) {
      case "usdt":
        return usdtNetworks
      default:
        return usdtNetworks
    }
  }

  // Sample withdrawal addresses
  const withdrawalAddresses: WithdrawalAddress[] = [
    {
      id: "addr1",
      label: "My Wallet",
      address: "TQXq3vXBYnRr1cjAq7bbt",
      network: "Tron(TRC20)",
    },
    {
      id: "addr2",
      label: "Exchange",
      address: "TDEFkTMA26CKsjZ74bcd",
      network: "Tron(TRC20)",
    },
    {
      id: "addr3",
      label: "Cold Storage",
      address: "THRCU7at3Ikqf4QSATU",
      network: "Tron(TRC20)",
    },
  ]

  // Sample withdrawal history
  const withdrawalHistory: WithdrawalHistory[] = [
    {
      id: "1",
      time: "07/13/2024, 17:56:36",
      reference: "214552800",
      address: "TQXq3vXBYnRr1cjAq7bbtuMfoZQx9Hkqa",
      addressShort: "TQXq3vXBYnRr1cjAq7bbt",
      network: "Tron(TRC20)",
      txid: "7760....5bc9",
      txidShort: "7760....5bc9",
      crypto: "USDT",
      amount: 5,
      fee: 1,
      status: "Sent",
    },
    {
      id: "2",
      time: "07/13/2024, 16:19:35",
      reference: "214531611",
      address: "TDEFkTMA26CKsjZ74bcdjdENkSZB2EHEr",
      addressShort: "TDEFkTMA26CKsjZ74bcd",
      network: "Tron(TRC20)",
      txid: "414a....fe13",
      txidShort: "414a....fe13",
      crypto: "USDT",
      amount: 11.3,
      fee: 1,
      status: "Sent",
    },
    {
      id: "3",
      time: "07/09/2024, 13:52:58",
      reference: "213405902",
      address: "THRCU7at3Ikqf4QSATUGTvbBnSaYQXKCB",
      addressShort: "THRCU7at3Ikqf4QSATU",
      network: "Tron(TRC20)",
      txid: "bda4....7c28",
      txidShort: "bda4....7c28",
      crypto: "USDT",
      amount: 11.3,
      fee: 1,
      status: "Sent",
    },
    {
      id: "4",
      time: "07/07/2024, 17:34:59",
      reference: "212977639",
      address: "TDn1HPkBo6pHBK7yMWudxv8wbAXXHB6jp",
      addressShort: "TDn1HPkBo6pHBK7yMW",
      network: "Tron(TRC20)",
      txid: "1d91....9465",
      txidShort: "1d91....9465",
      crypto: "USDT",
      amount: 11.4,
      fee: 1,
      status: "Sent",
    },
  ]

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (coinDropdownRef.current && !coinDropdownRef.current.contains(event.target as Node)) {
        setCoinDropdownOpen(false)
      }
      if (networkDropdownRef.current && !networkDropdownRef.current.contains(event.target as Node)) {
        setNetworkDropdownOpen(false)
      }
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(event.target as Node)) {
        setAddressDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle coin selection
  const handleCoinSelect = (coin: CryptoCoin) => {
    setSelectedCoin(coin)
    setCoinDropdownOpen(false)
    setSelectedNetwork(getNetworksForCoin(coin.id)[0])
  }

  // Handle network selection
  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network)
    setNetworkDropdownOpen(false)
  }

  // Handle address selection
  const handleAddressSelect = (address: WithdrawalAddress) => {
    setSelectedAddress(address)
    setAddressDropdownOpen(false)
    setCustomAddress(address.address)
  }

  // Handle copy address
  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="bg-gray-600/15 max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Withdrawal Form */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-8">Withdrawal</h1>

          <div className="space-y-8">
            {/* Step 1: Select Crypto */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 font-medium">
                  1
                </div>
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-medium mb-3">Select crypto</h2>
                <div ref={coinDropdownRef} className="relative">
                  <button
                    className="w-full flex items-center justify-between bg-gray-100 rounded-md p-3"
                    onClick={() => setCoinDropdownOpen(!coinDropdownOpen)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full ${selectedCoin.color} mr-2 flex items-center justify-center text-white font-bold text-xs`}
                      >
                        {selectedCoin.icon}
                      </div>
                      <span>{selectedCoin.symbol}</span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {coinDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {coins.map((coin) => (
                        <div
                          key={coin.id}
                          className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCoinSelect(coin)}
                        >
                          <div
                            className={`w-6 h-6 rounded-full ${coin.color} mr-2 flex items-center justify-center text-white font-bold text-xs`}
                          >
                            {coin.icon}
                          </div>
                          <span>{coin.symbol}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Set Destination */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 font-medium">
                  2
                </div>
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-medium mb-3">Set destination</h2>

                {/* Withdrawal Type Tabs */}
                <div className="mb-4">
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`py-2 px-4 font-medium ${
                        withdrawalType === "on-chain"
                          ? "text-red-500 border-b-2 border-red-500"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setWithdrawalType("on-chain")}
                    >
                      On-chain withdrawal
                    </button>
                    <button
                      className={`py-2 px-4 font-medium ${
                        withdrawalType === "internal"
                          ? "text-red-500 border-b-2 border-red-500"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setWithdrawalType("internal")}
                    >
                      Internal withdrawal
                    </button>
                  </div>
                </div>

                {/* Network Selection */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Network</label>
                  <div ref={networkDropdownRef} className="relative">
                    <button
                      className="w-full flex items-center justify-between bg-gray-100 rounded-md p-3"
                      onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full ${selectedNetwork.color} mr-2 flex items-center justify-center text-white font-bold text-xs`}
                        >
                          {selectedNetwork.icon}
                        </div>
                        <span>{selectedNetwork.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Circle className="h-4 w-4 text-gray-400 mr-1" />
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>

                    {networkDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {getNetworksForCoin(selectedCoin.id).map((network) => (
                          <div
                            key={network.id}
                            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleNetworkSelect(network)}
                          >
                            <div
                              className={`w-6 h-6 rounded-full ${network.color} mr-2 flex items-center justify-center text-white font-bold text-xs`}
                            >
                              {network.icon}
                            </div>
                            <span>{network.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-700">Address</label>
                    <button className="text-blue-500 text-sm flex items-center hover:underline">
                      Manage address book <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div ref={addressDropdownRef} className="relative">
                    <div className="flex">
                      <div className="relative w-full">
                        <Input
                          type="text"
                          placeholder="Enter address or select from address book"
                          className="w-full border-gray-300 rounded-md pr-10"
                          value={customAddress}
                          onChange={(e) => setCustomAddress(e.target.value)}
                        />
                        <button
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
                        >
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {addressDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {withdrawalAddresses.map((address) => (
                          <div
                            key={address.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleAddressSelect(address)}
                          >
                            <div className="font-medium">{address.label}</div>
                            <div className="text-sm text-gray-500 flex items-center justify-between">
                              <span>{address.address}</span>
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{address.network}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-red-500 text-sm mt-1">Enter withdrawal address</p>
                </div>
              </div>
            </div>

            {/* Step 3: Set Withdrawal Amount */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 font-medium">
                  3
                </div>
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-medium mb-3">Set withdrawal amount</h2>
                {/* Amount input would go here */}
              </div>
            </div>
          </div>

          {/* Withdrawal History */}
          <div className="mt-12">
            <div className="border-b border-gray-200 mb-4">
              <div className="flex">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "usdt" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("usdt")}
                >
                  USDT withdrawals
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "all" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All withdrawals
                </button>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <button className="text-blue-500 text-sm flex items-center hover:underline">
                Open history <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Reference no.</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">TXID</th>
                    <th className="px-4 py-3">Crypto</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Fee</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawalHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.time}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.reference}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-gray-900">{item.addressShort}</span>
                            <button
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              onClick={() => handleCopyAddress(item.address)}
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="text-gray-500 text-xs">{item.network}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center text-blue-500">
                          <span>{item.txidShort}</span>
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.crypto}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.fee}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 text-blue-800 text-xs font-medium bg-blue-100 rounded-full">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-500 hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - FAQ and Limits */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">How do I make a withdrawal?</h3>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Why have I still not received my withdrawal?</h3>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  How do I select the correct network for my crypto withdrawals and deposits?
                </h3>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Do I need to pay fees for deposit and withdrawal?</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-2">24h available limit</h2>
            <p className="text-gray-900 font-medium">9,992,457.63 / 9,992,457.63 USDT</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawalPage