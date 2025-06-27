import { assertIsAddress } from 'gill'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { AppHero } from '@/components/app-hero'
import { ellipsify } from '@/lib/utils'

import {
  AccountBalance,
  AccountButtons,
  AccountTokens,
  AccountTransactions,
} from './account-ui'

export default function AccountFeatureDetail() {
  const params = useParams()
  const address = useMemo(() => {
    if (!params.address || typeof params.address !== 'string') {
      return
    }
    assertIsAddress(params.address)
    return params.address
  }, [params])

  if (!address) {
    return <div>Error loading account</div>
  }

  return (
  <>
    <AppHero
      title="My Portfolio Dashboard for Cryptocurrency Assets"
      subtitle={
        <div className="my-4">
          <ExplorerLink address={address.toString()} label={ellipsify(address.toString())} />
        </div>
      }
    >
      <div className="my-4">
        <AccountButtons address={address} />
      </div>
    </AppHero>

    {/* Main Content - STACKED for all screens */}
    <div className="flex flex-col gap-8 p-4">
      {/* SOL Balance */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">SOL Balance</h2>
        <AccountBalance address={address} />
      </div>

      {/* Token Holdings */}
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Token Holdings & Assets</h2>
        <div className="min-w-full">
          <AccountTokens address={address} />
        </div>
      </div>

      {/* Transaction History */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
        <AccountTransactions address={address} />
      </div>
    </div>
  </>
)
}
