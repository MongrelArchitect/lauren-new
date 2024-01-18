import loadingIcon from "@assets/icons/loading.svg";

interface Props {
  overlay?: boolean;
}

export default function Loading({ overlay }: Props) {
  return (
    <div
      className={
        overlay
          ? "absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-brand-white"
          : ""
      }
    >
      <img
        alt=""
        className="red-icon h-[32px] animate-spin"
        src={loadingIcon}
      />
      Loading...
    </div>
  );
}
