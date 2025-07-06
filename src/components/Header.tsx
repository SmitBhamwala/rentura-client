export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="mb-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </header>
  );
}
