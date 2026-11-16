import type Note from '@/types/note'

export default function NoteCard({ note }: {note: Note}) {
    return (
    <section className="note-detail-card">
      <p className="site-eyebrow">Class note</p>
      <h1>{note.class_title}</h1>
      <dl className="note-details">
        <div>
          <dt>Class code</dt>
          <dd>{note.class_code}</dd>
        </div>
        <div>
          <dt>Semester</dt>
          <dd>{note.semester}</dd>
        </div>
        <div>
          <dt>Professor</dt>
          <dd>{note.professor ?? 'Unknown'}</dd>
        </div>
        <div>
          <dt>Unit</dt>
          <dd>{note.unit ?? 'Unknown'}</dd>
        </div>
        <div>
          <dt>Description</dt>
          <dd>{note.description ?? 'No description provided.'}</dd>
        </div>
      </dl>
    </section>
    );
}