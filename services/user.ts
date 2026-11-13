'use server'

import { createClient } from '@/utils/supabase/server';
import { executeSupabaseQuery } from '@/utils/supabase/query';
import type Profile from '@/types/profile';

export async function getProfile(userId: string) {
    const supabase = await createClient();

    return executeSupabaseQuery(
      supabase
        .from('profile')
        .select('bio')
        .eq('id', userId)
        .maybeSingle(),
      'load profile',
      'Could not load your profile. Please try again.'
    );
}

export async function updateProfile(profile: Omit<Profile, 'id'>) {
    const supabase = await createClient();

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

    if (claimsError) {
        console.error('Failed to verify the current user:', claimsError);
        throw new Error('Failed to verify the current user.');
    }
    if (!claimsData?.claims) {
        throw new Error('A user must be signed in to change their profile.');
    }

    return executeSupabaseQuery(
      supabase
        .from('profile')
        .update(profile)
        .eq('id', claimsData.claims.sub),
      'update profile',
      'Could not update your profile. Please try again.'
    );
}