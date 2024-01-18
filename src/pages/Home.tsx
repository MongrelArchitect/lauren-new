import HomeImage from "@components/HomeImage";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1 className="text-3xl">Fine Art</h1>
      <HomeImage />
    </div>
  );
}
