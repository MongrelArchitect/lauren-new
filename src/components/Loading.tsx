import loadingIcon from "@assets/icons/loading.svg";

interface Props {
  overlay?: boolean;
}

export default function Loading({ overlay }: Props) {
  return (
    <div
      className={
        overlay
          ? "absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white min-h-[500px]"
          : ""
      }
    >
      <img alt="" className="h-[32px] animate-spin" src={loadingIcon} />
      Loading...
    </div>
  );
}
