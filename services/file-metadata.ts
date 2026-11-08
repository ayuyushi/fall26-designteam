'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import type File from '@/types/file';

export async function uploadFileMetadata(fileMetadata: File | File[]) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("file")
        .insert(fileMetadata)
        .select('note_id, file_id, name, type, size')

    if (error) {
        console.error(error)
    }

    revalidatePath('/notes')
    revalidatePath('/library')
    return {data: data, error: error};
}

export async function getNoteFileMetadata(noteId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('file')
    .select('note_id, file_id, name, type, size')
    .eq('note_id', noteId)
  
  if (error) {
    console.error(error)
  }

  if (!data) {
    return { error: "Files not found." };
  }

  return {data: data, error: error};
}

export async function getFileMetadata(noteId: string, fileId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('file')
    .select('note_id, file_id, name, type, size')
    .eq('note_id', noteId)
    .eq("file_id", fileId)
    .maybeSingle()
  
  if (error) {
    console.error(error)
  }

  if (!data) {
    return { data: data, error: "File not found." };
  }

  return {data: data, error: error};
}

export async function getFilesMetadata(noteId: string, fileId: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('file')
    .select('note_id, file_id, name, type, size')
    .eq('note_id', noteId)
    .in("file_id", fileId)
  
  if (error) {
    console.error(error)
  }

  if (!data) {
    return { data: data, error: "File not found." };
  }

  return {data: data, error: error};
}

export async function deleteFileMetadata(noteId: string, fileId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('file')
    .delete()
    .eq("note_id", noteId)
    .eq("file_id", fileId)
    .select('note_id, file_id, name, type, size')
    .maybeSingle()
  
  if (error) {
    console.error(error)
  }

  if (!data) {
    return { data: data, error: "File not found." };
  }

  return {data: data, error: error};
}