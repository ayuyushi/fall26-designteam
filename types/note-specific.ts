import Note from '@/types/note';

export default interface NoteSpecific extends Note {
    is_favorited: boolean;
    is_author: boolean;
}