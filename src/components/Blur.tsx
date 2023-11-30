interface BlurProps {
  zIndex? : number;
}

export default function Blur({ zIndex }: BlurProps) {
  return (
    <div className={`absolute left-0 top-0 min-h-[100svh] min-w-[100svw] bg-white/30 backdrop-blur-sm ${zIndex ? `z-[${zIndex}]}` : null}`}></div>
  );
}
