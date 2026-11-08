import type Note from '@/types/note'

export default function NoteCard({ note }: {note: Note}) {
    return (
    <section>
        <h1>{note.class_title}</h1>
      <dl>
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
          <dd>{note.description || 'No description'}</dd>
        </div>
      </dl>
    </section>
    );
}