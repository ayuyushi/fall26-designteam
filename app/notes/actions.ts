'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createNote(formData: FormData) {
    const supabase = await createClient()

    //TODO: VALIDATE
    const input_data = {
        class_title: formData.get('class_title')! as string,
        class_code:  formData.get('class_code')! as string,
        semester:  formData.get('semester')! as string,
        professor:  formData.get('professor') as string ?? "Unknown",
        unit:  formData.get('unit') as string ?? "Unknown",
        description:  formData.get('description') as string ?? "",
        is_public: true,
    }

    const { data, error } = await supabase
        .from("note")
        .insert(input_data)
        .select()

    if (error) {
        console.error(error)
        return {success: false, error: error}
    }

    return {success: true, data: data};
}

export async function getNotes() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("note")
        .select('*')

    if (error) {
        console.error(error)
        return {success: false, error: error}
    }

    return {success: true, data: data};
}
