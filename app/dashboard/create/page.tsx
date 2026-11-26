import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import NoteForm from './note-form'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Notes"
};

export default async function CreatePage() {
    const supabase = await createClient();

    const { data: claimsData } = await supabase.auth.getClaims()
    if(!claimsData?.claims){
        redirect('/login') //redirect to login page if not valid authentication
    };

    return (
    <main className="site-page create-note-page">
        <section className="site-content create-note-content">
            <div className="account-intro notes-intro">
                <p className="site-eyebrow">Your space</p>
                <h1>Create note</h1>
                <p>Create a note!</p>
            </div>
            <NoteForm />
        </section>
    </main>
    );
}