import HomeImage from "@components/HomeImage";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl">Lauren Mendelsohn-Bass</h1>
      <h2 className="text-2xl italic">Fine Art</h2>
      <HomeImage />
    </div>
  );
}
