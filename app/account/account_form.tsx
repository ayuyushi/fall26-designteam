'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type Claims = { sub: string; email?: string; [key: string]: unknown }

export default function AccountForm({ claims }: { claims: Claims | null }) {
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [ufid, setUfid] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
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
        .select(`ufid, username, bio`)
        .eq('id', userId)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setUfid(data.ufid)
        setUsername(data.username)
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

  async function updateProfile({
    username,
    bio
  }: {
    username: string | null
    bio: string | null
  }) {
    try {
      if (!claims?.sub) {
        alert('You must be logged in to update your profile')
        return
      }

      setLoading(true)
  
      const { error } = await supabase.from('profile').update({
        username,
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
    <div className="form-widget">
      <div>
        <label htmlFor="ufid">UFID</label>
        <input
          id="ufid"
          type="text"
          value={ufid || 'NOT LOGGED IN'}
          readOnly
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="bio">Bio</label>
        <input
          id="bio"
          type="url"
          value={bio || ''}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, bio})}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}