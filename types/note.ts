export default interface Note {
    id: string
    class_title: string,
    class_code:  string,
    semester: string,
    professor?:  string,
    unit?: string,
    description?: string,
    is_public: boolean,
}