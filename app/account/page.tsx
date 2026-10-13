import AccountForm from './account_form'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()

  return <AccountForm claims={claimsData?.claims ?? null} />
}