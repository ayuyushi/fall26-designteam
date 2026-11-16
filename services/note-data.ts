'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { executeSupabaseQuery } from '@/utils/supabase/query';
import type Note from '@/types/note';

type newNote = Omit<Note, 'id'>;

export async function createNote(noteData: newNote | Note[]) {
    const supabase = await createClient();

    const result = await executeSupabaseQuery(
      supabase
        .from("note")
        .insert(noteData)
        .select('id, class_title, class_code, semester, professor, unit, description, is_public'),
      'create note',
      'Could not create the note. Please try again.'
    );

    if (!result.error) {
      revalidatePath('/notes');
      revalidatePath('/library');
    }

    return result;
}

export async function getNote(noteId: string) {
    const supabase = await createClient();

    return executeSupabaseQuery(
      supabase
        .from("note")
        .select('id, class_title, class_code, semester, professor, unit, description, is_public')
        .eq("id", noteId)
        .maybeSingle(),
      'load note',
      'Could not load the note. Please try again.'
    );
}

export async function getPublicNotes(filters: Record<string, string> = {}, num: number = 20, offset: number = 0) {
    const supabase = await createClient();

    let query = supabase
        .from('note')
        .select('*', { count: 'exact' })
        .eq('is_public', true)
        .range(offset, offset + num - 1);

    for (const key in filters) {
        query = query.like(key, `%${filters[key]}%`);
    }

    const result = await executeSupabaseQuery(
      query,
      'load public notes',
      'Could not load public notes. Please try again.'
    );

    return result;
}

export async function getOwnNotes(filters: Record<string, string> = {}, num: number = 20, offset: number = 0) {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

    if (claimsError) {
        console.error('Failed to verify the current user:', claimsError);
        throw new Error('Failed to verify the current user.');
    }
    if (!claimsData?.claims) {
        throw new Error('A user must be signed in to load their collection.');
    }

    let query = supabase
        .from('note')
        .select('*', { count: 'exact' })
        .eq('author_id', claimsData.claims.sub)
        .range(offset, offset + num);

    for (const key in filters) {
        query = query.like(key, `%${filters[key]}%`);
    }

    const result = await executeSupabaseQuery(
      query,
      'load the user collection',
      'Could not load your collection. Please try again.'
    );

    return result;
}

export async function deleteNote(noteId: string) {
    const supabase = await createClient();

    const result = await executeSupabaseQuery(
      supabase
        .from("note")
        .delete()
        .eq("id", noteId),
      'delete note',
      'Could not delete the note. Please try again.'
    );

    if (!result.error) {
      revalidatePath('/notes');
      revalidatePath('/library');
    }

    return result;
}