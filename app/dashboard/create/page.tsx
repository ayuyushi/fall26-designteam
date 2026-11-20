import NoteForm from './note-form'

export default function CreatePage() {
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