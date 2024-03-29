interface Props {
  close?: () => void;
}

export default function Blur({ close }: Props) {
  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-20 min-h-[100lvh] min-w-[100svw] bg-brand-black/40 backdrop-blur-sm"
      onClick={close}
    />
  );
}
