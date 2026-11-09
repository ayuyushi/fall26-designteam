'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import type Note from '@/types/note';

export async function createNote(noteData: Partial<Note> | Partial<Note>[]) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("note")
        .insert(noteData)
        .select('id, class_title, class_code, semester, professor, unit, description, is_public')

    if (error) {
        console.error(error)
    }

    revalidatePath('/notes')
    revalidatePath('/library')
    return {data: data, error: error};
}

export async function getNote(noteId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("note")
        .select('id, class_title, class_code, semester, professor, unit, description, is_public')
        .eq("id", noteId)
        .maybeSingle()

    if (error) {
        console.error(error)
    }

    return {data: data, error: error};
}

export async function getPublicNotes() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('note')
        .select('*')
        .eq('is_public', true);

    if (error) {
        console.error('Failed to load public notes:', error);
    }

    return { data, error };
}

export async function getOwnNotes() {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

    if (claimsError) {
        console.error('Failed to verify the current user:', claimsError);
        throw new Error('Failed to verify the current user.');
    }
    if (!claimsData?.claims) {
        throw new Error('A user must be signed in to load their collection.');
    }

    const { data, error } = await supabase
        .from('note')
        .select('*')
        .eq('author_id', claimsData.claims.sub);

    if (error) {
        console.error('Failed to load the user collection:', error);
    }

    return { data, error };
}

export async function deleteNote(noteId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("note")
        .delete()
        .eq("id", noteId)

    if (error) {
        console.error(error)
    }

    revalidatePath('/notes')
    revalidatePath('/library')
    return {data: data, error: error};
}