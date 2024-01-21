import loadingIcon from "@assets/icons/loading.svg";

interface Props {
  overlay?: boolean;
}

export default function Loading({ overlay }: Props) {
  return (
    <div
      className={
        overlay
          ? "absolute left-0 top-0 z-10 flex h-full w-full flex-wrap items-center justify-center gap-1 bg-brand-white text-2xl"
          : "flex flex-wrap items-center gap-1 text-2xl"
      }
    >
      <span>Loading...</span>
      <img
        alt=""
        className="red-icon h-[56px] animate-spin"
        src={loadingIcon}
      />
    </div>
  );
}
