import Link from 'next/link';
import Header from '@/components/header'

export default function Loading() {
    return (
    <main className="site-page">
        <Header visibility='auth' current='/notes'/>
        <section className="site-content note-detail-content">
        <Link className="note-back-link" href="/notes">← Back to notes</Link>
        <section className="note-detail-card">
            <h3 className="site-eyebrow">Loading note...</h3>
            <dl className="note-details">
            </dl>
        </section>
        <div className="file-workspace">
        </div>
        </section>
    </main>
    );
}