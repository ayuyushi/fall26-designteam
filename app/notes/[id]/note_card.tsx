type NoteCardProps = {
    note: {
        class_title: string;
        class_code: string;
        semester: string;
        professor: string | null;
        unit: string | null;
        description: string | null;
    };
};

export default function NoteCard({ note }: NoteCardProps) {
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
          <dd>{note.professor || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Unit</dt>
          <dd>{note.unit || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Description</dt>
          <dd>{note.description || 'No description provided.'}</dd>
        </div>
      </dl>
    </section>
    );
}