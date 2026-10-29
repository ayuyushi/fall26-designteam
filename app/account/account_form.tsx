'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type Claims = { sub: string; email?: string; [key: string]: unknown }

export default function AccountForm({ claims }: { claims: Claims | null }) {
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      if (!claims?.sub) {
        setLoading(false)
        return
      }

      setLoading(true)

      const userId = claims.sub
      const { data, error, status } = await supabase
        .from('profile')
        .select(`bio`)
        .eq('id', userId)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setBio(data.bio)
      }
    } catch (error) {
      console.log(error)
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [claims, supabase])

  useEffect(() => {
    getProfile()
  }, [claims, getProfile])

  async function updateProfile({bio}: {bio: string | null}) {
    try {
      if (!claims?.sub) {
        alert('You must be logged in to update your profile')
        return
      }

      setLoading(true)
  
      const { error } = await supabase.from('profile').update({
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', claims.sub)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget profile-form">
      <div className="profile-field">
        <label htmlFor="email">UF Email</label>
        <input
          id="email"
          type="text"
          value={claims?.email || 'Unknown'}
          readOnly
        />
      </div>
      <div className="profile-field">
        <label htmlFor="bio">Bio</label>
        <input
          id="bio"
          type="url"
          value={bio || 'No Bio'}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block profile-submit"
          onClick={() => updateProfile({bio})}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block profile-signout" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}