"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
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
}

interface WithdrawalAddress {
  id: string
  label: string
  address: string
}

const WithdrawDashboard = ()=> {
  // State for dropdown visibility
  const [coinDropdownOpen, setCoinDropdownOpen] = useState(false)
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false)
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false)

  // State for selected values
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>({
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    icon: "₿",
    color: "from-orange-400 to-orange-600",
  })

  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<WithdrawalAddress | null>(null)

  // State for form inputs
  const [fundPassword, setFundPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [amount, setAmount] = useState("")
  const [otp, setOtp] = useState("")

  // Refs for dropdown elements
  const coinDropdownRef = useRef<HTMLDivElement>(null)
  const networkDropdownRef = useRef<HTMLDivElement>(null)
  const addressDropdownRef = useRef<HTMLDivElement>(null)

  // Sample data for cryptocurrencies
  const coins: CryptoCoin[] = [
    { id: "btc", symbol: "BTC", name: "Bitcoin", icon: "₿", color: "from-orange-400 to-orange-600" },
    { id: "eth", symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "from-purple-400 to-purple-600" },
    { id: "usdt", symbol: "USDT", name: "Tether", icon: "T", color: "from-teal-400 to-teal-600" },
    { id: "sol", symbol: "SOL", name: "Solana", icon: "S", color: "from-blue-400 to-blue-600" },
    { id: "xrp", symbol: "XRP", name: "Ripple", icon: "X", color: "from-gray-400 to-gray-600" },
  ]

  // Networks for BTC
  const btcNetworks: Network[] = [
    { id: "btc", name: "Bitcoin" },
    { id: "lightning", name: "Lightning Network" },
  ]

  // Networks for ETH
  const ethNetworks: Network[] = [
    { id: "eth", name: "Ethereum" },
    { id: "arbitrum", name: "Arbitrum" },
    { id: "optimism", name: "Optimism" },
  ]

  // Get networks based on selected coin
  const getNetworksForCoin = (coinId: string): Network[] => {
    switch (coinId) {
      case "btc":
        return btcNetworks
      case "eth":
        return ethNetworks
      default:
        return [{ id: "default", name: "Default Network" }]
    }
  }

  // Sample withdrawal addresses
  const withdrawalAddresses: WithdrawalAddress[] = [
    { id: "addr1", label: "My Hardware Wallet", address: "bc1q9h6mqc7stvak8qj2lmxh3j4zs09jgvpk4n2hnn" },
    { id: "addr2", label: "Exchange Account", address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5" },
    { id: "addr3", label: "Cold Storage", address: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT" },
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
    setSelectedNetwork(null)
    setSelectedAddress(null)
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
  }

  // Handle withdraw button click
  const handleWithdraw = () => {
    if (!selectedNetwork) {
      alert("Please select a network")
      return
    }
    if (!selectedAddress) {
      alert("Please select a withdrawal address")
      return
    }
    if (!fundPassword) {
      alert("Please enter your fund password")
      return
    }
    if (!amount) {
      alert("Please enter an amount")
      return
    }
    if (!otp) {
      alert("Please enter OTP")
      return
    }

    // Here you would handle the actual withdrawal process
    alert(`Withdrawal initiated for ${amount} ${selectedCoin.symbol}`)
  }

  return (
    <div className="min-h-screen bg-stone-900/20 mb-20 shadow-stone-800 border-1 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="inline-block bg-white text-[#121212] px-6 py-3 rounded-t-lg font-medium">
            <span className="text-orange-500">Crypto</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Select Coin */}
            <div ref={coinDropdownRef} className="relative">
              <label className="block text-white mb-2">Select Coin</label>
              <button
                className="w-full flex items-center justify-between bg-[#1a1a1a] border border-[#333] rounded-md p-3 text-white"
                onClick={() => setCoinDropdownOpen(!coinDropdownOpen)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-2 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${selectedCoin.color} rounded-full`}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                      {selectedCoin.icon}
                    </div>
                  </div>
                  <span>{selectedCoin.symbol}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>

              {coinDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-[#333] rounded-md shadow-lg max-h-60 overflow-auto">
                  {coins.map((coin) => (
                    <div
                      key={coin.id}
                      className="flex items-center p-3 hover:bg-[#222] cursor-pointer"
                      onClick={() => handleCoinSelect(coin)}
                    >
                      <div className="w-8 h-8 mr-2 relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${coin.color} rounded-full`}></div>
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                          {coin.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{coin.symbol}</div>
                        <div className="text-sm text-gray-400">{coin.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Warning Messages */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-md p-4">
              <ul className="list-disc pl-5 space-y-2 text-orange-500">
                <li className="text-sm">
                  Do not crowdfund or directly withdraw to ICO addresses as tokens from such sales will not be credited
                  to your account.
                </li>
                <li className="text-sm">
                  Transfers between Cryptimize accounts are internal transfers, there is no transaction fee for internal
                  transfers and the entire amount you enter in the amount section is sent to the recipient.
                </li>
              </ul>
            </div>

            {/* Network */}
            <div ref={networkDropdownRef} className="relative">
              <label className="block text-white mb-2">Network</label>
              <button
                className="w-full flex items-center justify-between bg-[#1a1a1a] border border-[#333] rounded-md p-3 text-white"
                onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
              >
                <span>{selectedNetwork ? selectedNetwork.name : "Please select network"}</span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>

              {networkDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-[#333] rounded-md shadow-lg max-h-60 overflow-auto">
                  {getNetworksForCoin(selectedCoin.id).map((network) => (
                    <div
                      key={network.id}
                      className="p-3 hover:bg-[#222] cursor-pointer"
                      onClick={() => handleNetworkSelect(network)}
                    >
                      <span>{network.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-gray-400 text-sm mt-2">
                Make sure the network you choose for the deposit matches the withdrawal network or your assets may be
                lost.
              </p>
            </div>

            {/* BTC Withdrawal Address */}
            <div ref={addressDropdownRef} className="relative">
              <label className="block text-white mb-2">{selectedCoin.symbol} Withdrawal Address</label>
              <button
                className="w-full flex items-center justify-between bg-[#1a1a1a] border border-[#333] rounded-md p-3 text-white"
                onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
              >
                <span>{selectedAddress ? selectedAddress.label : "Select withdrawals address"}</span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>

              {addressDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-[#333] rounded-md shadow-lg max-h-60 overflow-auto">
                  {withdrawalAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-3 hover:bg-[#222] cursor-pointer"
                      onClick={() => handleAddressSelect(address)}
                    >
                      <div className="font-medium">{address.label}</div>
                      <div className="text-sm text-gray-400 truncate">{address.address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Fund Password */}
            <div>
              <label className="block text-white mb-2">Fund Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Funding Password"
                  className="w-full bg-[#1a1a1a] border-[#333] text-white"
                  value={fundPassword}
                  onChange={(e) => setFundPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="mt-2">
                <a href="#" className="text-orange-500 text-sm hover:underline">
                  I forgot my password?
                </a>
              </div>
            </div>

            {/* Balance */}
            <div className="bg-gray-600 bg-opacity-30 rounded-md p-3">
              <div className="text-gray-300">Balance: 0 {selectedCoin.symbol}≈0 USDT</div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-white mb-2">Amount</label>
              <Input
                type="text"
                placeholder={`Minimum 0`}
                className="w-full bg-[#1a1a1a] border-[#333] text-white"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* OTP */}
            <div>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  className="flex-1 bg-[#1a1a1a] border-[#333] text-white"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button className="bg-[#1a1a1a] border border-[#333] hover:bg-[#222] text-white">Request OPT</Button>
              </div>
            </div>

            {/* Receivable and Withdraw Button */}
            <div className="flex items-center justify-between mt-8">
              <div className="text-white">Receiveable: 0.00 {selectedCoin.symbol}</div>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-black font-medium px-8 py-2"
                onClick={handleWithdraw}
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawDashboard