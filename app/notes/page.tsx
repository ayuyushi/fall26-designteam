"use client";

export type NewNote = {
  class_title: string;
  class_code: string;
  semester: string;
  professor?: string;
  unit?: string;
  description?: string;
  is_public: boolean;
};


export default function NotesPage() {
    
 
  const handleCreateNote = (note: NewNote) => {};

  return (
    <main className="p-6">
      <button
        type="button"
         onClick={() =>
          handleCreateNote({
            class_title: "Notes",
            class_code: "COP3290",
            semester: "Fall 2026",
            professor: "",
            unit: "",
            description: "",
            is_public: true,
          })
        }
        className="rounded-full border px-6 py-2"
        style={{ 
            background: "#F9CBE7",
            color: "#7D2572",
            borderColor: "#7D2572",
            }}

      >
        Create Note
      </button>
    </main>
  );
}