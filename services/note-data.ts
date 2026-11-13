'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import type Note from '@/types/note';

type newNote = Omit<Note, 'id'>;

export async function createNote(noteData: newNote | Note[]) {
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

export async function getPublicNotes(filters: Record<string, string>, num: number = 20, offset: number) {
    const supabase = await createClient();

    let query = supabase
        .from('note')
        .select('*', { count: 'exact' })
        .eq('is_public', true)
        .range(offset, offset + num - 1);

    for (const key in filters) {
        query = query.like(key, `%${filters[key]}%`);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error('Failed to load public notes:', error);
    }

    return { data, count, error };
}

export async function getOwnNotes(filters: Record<string, string>, num: number, offset: number) {
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

    const { data, count, error } = await query;

    if (error) {
        console.error('Failed to load the user collection:', error);
    }

    return { data, count, error };
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