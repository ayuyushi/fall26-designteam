interface FilterBarProps {
  filters: Record<string, string>;
  onChange: (column: string, value: string) => void;
  onReset: () => void;
}

export default function filterBar({ filters, onChange, onReset } : FilterBarProps) {
return (
    <aside className="w-64 p-4 border-r bg-white flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Filters</h2>
        <button 
          onClick={onReset} 
          className="text-sm text-blue-600 hover:underline"
        >
          Reset
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Class Title</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange('class_title', e.target.value)}
          placeholder="Class Title..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Class Code</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange('class_code', e.target.value)}
          placeholder="Class Code..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Semester</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange('semester', e.target.value)}
          placeholder="Semester..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Professor</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange('professor', e.target.value)}
          placeholder="Professor..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Unit</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange('unit', e.target.value)}
          placeholder="Unit..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>

    {/* TODO: CHANGE SECTIONS LIKE SEMESTER TO BE CATEGORICAL */}
      {/* <div>
        <label className="block text-sm font-medium mb-1">Semester</label>
        <select
          value={filters.semester}
          onChange={(e) => onChange('semester', e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Apparel">Apparel</option>
          <option value="Home">Home</option>
        </select>
      </div> */}
    </aside>
  );
}