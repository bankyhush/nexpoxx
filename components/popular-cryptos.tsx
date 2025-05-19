"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowDown, ArrowUp } from "lucide-react"

interface Cryptocurrency {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

export function PopularCryptos() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCryptoData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h",
      )

      if (!response.ok) {
        throw new Error("Failed to fetch cryptocurrency data")
      }

      const data = await response.json()
      setCryptos(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching crypto data:", err)
      setError("Failed to load cryptocurrency data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptoData()

    // Set up interval to refresh data every 60 seconds
    const intervalId = setInterval(fetchCryptoData, 60000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatPriceChange = (change: number) => {
    return change.toFixed(2)
  }

  if (loading && cryptos.length === 0) {
    return (
      <div className="w-full py-12 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-zinc-800 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-4xl">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-zinc-800 p-6 rounded-lg flex flex-col items-center">
                <div className="h-12 w-12 bg-zinc-700 rounded-full mb-4"></div>
                <div className="h-5 w-16 bg-zinc-700 rounded mb-2"></div>
                <div className="h-4 w-24 bg-zinc-700 rounded mb-4"></div>
                <div className="h-6 w-28 bg-zinc-700 rounded mb-2"></div>
                <div className="h-5 w-16 bg-zinc-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Popular Cryptocurrencies</h2>
        <div className="bg-red-900/20 border border-red-800 text-red-100 p-4 rounded-lg max-w-lg mx-auto">
          <p>{error}</p>
          <button onClick={fetchCryptoData} className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#000000ee] rounded-tl-2xl rounded-tr-2xl">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
        <div className="flex space-x-6 text-sm font-medium">
          <span className="text-white relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-yellow-500">
            Popular
          </span>
          <span className="text-zinc-500">New Listing</span>
        </div>
        <button className="text-sm text-zinc-400 hover:underline">View All 350+ Coins ›</button>
      </div>
  
      <div className="flex flex-col space-y-4">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="flex items-center justify-between text-white">
            {/* Left: Icon + Name */}
            <div className="flex items-center space-x-3 w-1/3">
              <Image
                src={crypto.image}
                alt={crypto.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <div className="font-semibold uppercase">{crypto.symbol}</div>
                <div className="text-sm text-zinc-400">{crypto.name}</div>
              </div>
            </div>
  
            {/* Middle: Price */}
            <div className="w-1/3 text-right font-semibold text-lg">
              {formatPrice(crypto.current_price)}
            </div>
  
            {/* Right: Price Change */}
            <div className="w-1/3 text-right font-medium text-red-500">
              {formatPriceChange(crypto.price_change_percentage_24h)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
}
