'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getProfile, updateProfile } from '@/services/user'

type Claims = { sub: string; email?: string; [key: string]: unknown }

export default function AccountForm({ claims }: { claims: Claims | null }) {
  const [loading, setLoading] = useState(true)
  const [bio, setBio] = useState<string>("")

  const getOwnProfile = useCallback(async () => {
    try {
      if (!claims?.sub) {
        setLoading(false)
        return
      }

      setLoading(true)

      const { data, error } = await getProfile(claims.sub)
      if (error) {
        throw new Error(error)
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
  }, [claims])

  useEffect(() => {
    getOwnProfile()
  }, [claims, getOwnProfile])

  async function updateOwnProfile({bio}: {bio: string}) {
    try {
      if (!claims?.sub) {
        alert('You must be logged in to update your profile')
        return
      }

      setLoading(true)
  
      const { error } = await updateProfile({
        bio,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        throw new Error(error)
      }
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
          onClick={() => updateOwnProfile({bio})}
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