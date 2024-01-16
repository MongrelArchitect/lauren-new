import loadingIcon from "@assets/icons/loading.svg";

interface Props {
  overlay?: boolean;
}

export default function Loading({ overlay }: Props) {
  return (
    <div
      className={
        overlay
          ? "z-10 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white"
          : ""
      }
    >
      <img alt="" className="h-[32px] animate-spin" src={loadingIcon} />
      Loading...
    </div>
  );
}
