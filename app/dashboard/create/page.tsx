import NoteForm from './note-form'

export default function CreatePage() {
    return (
    <main className="site-page">
        <section className="site-content notes-page-content">
            <div className="account-intro notes-intro">
                <p className="site-eyebrow">Your space</p>
                <h1>Create note</h1>
                <p>Create a note!</p>
                <NoteForm />
            </div>
        </section>
    </main>
    );
}