export default function Amenities({ amenities }: { amenities: string[] }) {
  if (!amenities.length) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {amenities.map(item => (
        <li
          key={item}
          className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
