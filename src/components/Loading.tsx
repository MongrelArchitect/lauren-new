import loadingIcon from "@assets/icons/loading.svg";

export default function Loading() {
  return (
    <div>
      <img alt="" className="h-[32px] animate-spin" src={loadingIcon} />
      Loading...
    </div>
  );
}
