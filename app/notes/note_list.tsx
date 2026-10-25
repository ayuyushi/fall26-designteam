import Link from 'next/link';
import { getNotes } from "./actions";

export default async function NotesList() {
    const {success, data, error} = await getNotes();

    if (!success) {
        console.error(error)
        return (<div className="notes-list"></div>);
    }

    return (
        <div className="notes-list">
            {data!.map((note) => (
                <li key={note.id}>
                    <Link href={`/notes/${note.id}`}>
                        {note.class_title}
                    </Link>
                </li>
            ))}
        </div>
    );
}