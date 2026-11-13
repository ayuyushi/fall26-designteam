'use server'

import { createClient } from '@/utils/supabase/server';
import type Profile from '@/types/profile';

export async function getProfile(userId: string) {
    const supabase = await createClient();

    const { data, error, status } = await supabase
        .from('profile')
        .select('bio')
        .eq('id', userId)
        .single();

    if (error && status !== 406) {
        console.log(error);
        throw error;
    }

    return { data, error };
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

    const { data, error, status } = await supabase
        .from('profile')
        .update(profile)
        .eq('id', claimsData.claims.sub);

    if (error && status !== 406) {
        console.log(error);
        throw error;
    }

    return { data, error };
}