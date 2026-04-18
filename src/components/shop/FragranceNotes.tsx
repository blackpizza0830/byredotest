interface FragranceNotesProps {
  productSlug: string;
}

interface Notes {
  top: string[];
  heart: string[];
  base: string[];
}

const NOTES_MAP: Record<string, Notes> = {
  "bal-d-afrique": {
    top: ["Marigold", "Bergamot", "Lemon"],
    heart: ["African Violet", "Jasmine", "Cyclamen"],
    base: ["Musk", "Cedarwood", "Vetiver"],
  },
  bibliotheque: {
    top: ["Peach", "Plum", "Pink Pepper"],
    heart: ["Iris", "Ylang Ylang", "Violet"],
    base: ["Vanilla", "Sandalwood", "Musk"],
  },
  default: {
    top: ["Bergamot", "Pepper", "Grapefruit"],
    heart: ["Rose", "Jasmine", "Iris"],
    base: ["Musk", "Sandalwood", "Amber"],
  },
};

export function FragranceNotes({
  productSlug,
}: FragranceNotesProps): React.JSX.Element {
  const notes = NOTES_MAP[productSlug] ?? NOTES_MAP.default;

  const NOTE_SECTIONS = [
    { label: "Top Notes", values: notes.top },
    { label: "Heart Notes", values: notes.heart },
    { label: "Base Notes", values: notes.base },
  ];

  return (
    <div className="border-t border-byredo-gray-200 pt-8">
      <h3 className="text-[10px] tracking-widest uppercase text-byredo-gray-400 mb-6">
        Fragrance Notes
      </h3>
      <div className="space-y-4">
        {NOTE_SECTIONS.map(({ label, values }) => (
          <div key={label} className="flex gap-8">
            <span className="text-[10px] tracking-wider uppercase text-byredo-gray-500 w-20 shrink-0 pt-0.5">
              {label}
            </span>
            <p className="text-sm text-byredo-gray-700">{values.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
