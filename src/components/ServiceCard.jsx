export default function ServiceCard({ name, description, price, duration }) {
  return (
    <div className="flex flex-col rounded-2xl border border-accent/40 bg-white/60 p-6 transition hover:shadow-md">
      <h3 className="font-heading text-xl">{name}</h3>
      {description && <p className="mt-2 text-sm opacity-70">{description}</p>}
      <p className="mt-4 text-sm opacity-70">{duration} min</p>
      <p className="mt-1 text-lg">₹{price}</p>
    </div>
  );
}