'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { executeSupabaseQuery } from '@/utils/supabase/query';
import type Note from '@/types/note';
import type NoteSpecific from '@/types/note-specific';

type newNote = Omit<Note, 'id'>;

export async function createNote(noteData: newNote | newNote[]) {
    const supabase = await createClient();

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

    if (claimsError) {
        console.error('Failed to verify the current user:', claimsError);
        throw new Error('Failed to verify the current user.');
    }
    if (!claimsData?.claims) {
        throw new Error('A user must be signed in to create notes.');
    }

    const result = await executeSupabaseQuery(
      supabase
        .from("note")
        .insert(noteData)
        .select('*'),
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

    const result = executeSupabaseQuery(
      supabase
        .from("note_specific")
        .select('*')
        .eq("id", noteId)
        .maybeSingle(),
      'load note',
      'Could not load the note. Please try again.'
    );

    return result;
}

export async function getPublicNotes(filters: Record<string, string> = {}, num: number = 20, offset: number = 0) {
    const supabase = await createClient();

    let query = supabase
        .from('note_specific')
        .select('*', { count: 'exact' })
        .eq('is_public', true)
        .range(offset, offset + num - 1);

    for (const key in filters) {
        query = query.ilike(key, `%${filters[key]}%`);
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
        .from('note_specific')
        .select('*', { count: 'exact' })
        .eq('is_author', true)
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

export async function insertFavoritedNote(noteId: string) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError) {
      console.error('Failed to verify the current user:', claimsError);
      throw new Error('Failed to verify the current user.');
  }
  if (!claimsData?.claims) {
      throw new Error('A user must be signed in to see their favorites.');
  }

  const query = supabase
      .from('favorited_note')
      .insert({'note_id': noteId, 'user_id': claimsData.claims.sub})
      .select('*');

  const result = await executeSupabaseQuery(
    query,
    'add to favorites',
    'Could not favorite note. Please try again.'
  );

  return result;
}

export async function getFavoritedNotes(filters: Record<string, string> = {}, num: number = 20, offset: number = 0) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError) {
      console.error('Failed to verify the current user:', claimsError);
      throw new Error('Failed to verify the current user.');
  }
  if (!claimsData?.claims) {
      throw new Error('A user must be signed in to see their favorites.');
  }

  const query = supabase
      .from('user_favorites')
      .select('*', { count: 'exact' })
      .range(offset, offset + num);

  const result = await executeSupabaseQuery(
    query,
    'load the user\'s favorites',
    'Could not load your favorite. Please try again.'
  );

  return result;
}

export async function deleteFavoritedNote(noteId: string) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError) {
      console.error('Failed to verify the current user:', claimsError);
      throw new Error('Failed to verify the current user.');
  }
  if (!claimsData?.claims) {
      throw new Error('A user must be signed in to delete a favorite.');
  }

  const query = supabase
      .from('favorited_note')
      .delete()
      .eq('note_id', noteId)
      .eq('user_id', claimsData.claims.sub)
      .select('*');

  const result = await executeSupabaseQuery(
    query,
    'delete from favorites',
    'Could not remove note from favorites. Please try again.'
  );

  return result;
}