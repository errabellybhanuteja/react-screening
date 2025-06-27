'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PortfolioData {
  balance: number
  tokens: TokenInfo[]
  totalValue: number
}

interface TokenInfo {
  mint: string
  amount: string
  decimals: number
  symbol?: string
}

export function PortfolioDashboard() {
  const { account, cluster } = useWalletUi()
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    balance: 0,
    tokens: [],
    totalValue: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const fetchPortfolioData = useCallback(async () => {
    if (!account) return

    setIsLoading(true)
    try {
      const mockData = {
        balance: 2500000000,
        tokens: [
          {
            mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            amount: '1000000',
            decimals: 6,
            symbol: 'USDC',
          },
          {
            mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
            amount: '500000000',
            decimals: 6,
            symbol: 'USDT',
          },
        ],
      }

      setPortfolio({
        balance: mockData.balance,
        tokens: mockData.tokens,
        totalValue: mockData.tokens.reduce((acc, t) => acc + parseFloat(t.amount), 0),
      })
    } catch (err) {
      console.error('Portfolio fetch error:', err)
      setError('Error loading portfolio')
    } finally {
      setIsLoading(false)
    }
  }, [account])

  useEffect(() => {
    if (account) {
      fetchPortfolioData()
    }
  }, [account, fetchPortfolioData])

  const formatBalance = (balance: number) => {
    return (balance / 1_000_000).toFixed(2)
  }

  if (!account) {
    return (
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-4">Portfolio Dashboard - Please Connect Wallet</h1>
        <div className="bg-yellow-200 p-6 rounded border-2 border-yellow-500">
          <p className="text-xl font-semibold">
            ⚠️ Please connect your Solana wallet to view your cryptocurrency portfolio.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">My Portfolio Dashboard for Cryptocurrency Assets</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Scrollable cards container */}
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col md:flex-row gap-4 min-w-[768px]">
          {/* SOL Balance */}
          <Card className="min-w-80 flex-shrink-0">
            <CardHeader>
              <CardTitle className="text-xl">SOL Balance Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-lg">Loading your balance...</div>
              ) : (
                <div>
                  <p className="text-4xl font-bold">{formatBalance(portfolio.balance)} SOL</p>
                  <p className="text-base text-gray-400">Current Network: {cluster.label}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Holdings */}
          <Card className="min-w-96 flex-shrink-0">
            <CardHeader>
              <CardTitle className="text-xl">Token Holdings & Assets</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.tokens.length === 0 ? (
                <p className="text-lg">No tokens found in wallet</p>
              ) : (
                <div className="space-y-3">
                  {portfolio.tokens.map((token, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start border-b pb-2 text-sm"
                    >
                      <div className="w-2/3 break-all">
                        <p className="text-lg font-medium">{token.symbol || 'Unknown Token'}</p>
                        <p className="text-xs text-gray-500 font-mono">{token.mint}</p>
                      </div>
                      <span className="text-sm font-mono text-right break-words">
                        {token.amount} tokens
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Value */}
          <Card className="min-w-72 flex-shrink-0">
            <CardHeader>
              <CardTitle className="text-xl">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                ${portfolio.totalValue.toFixed(2)} USD
              </p>
              <Button
                onClick={fetchPortfolioData}
                disabled={isLoading}
                className="mt-6 w-full text-lg py-4 px-8"
              >
                Refresh Portfolio Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
