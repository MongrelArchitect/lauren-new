import Blur from "./Blur";

interface Props {
  children: React.ReactNode;
  visible: boolean;
}

export default function Modal({ children, visible }: Props) {
  return (
    <>
      {visible ? <Blur /> : null}
      <div
        className={`${
          visible ? null : "-translate-y-[100%]"
        } absolute left-0 top-0 z-30 flex h-full w-full items-start  justify-center transition-transform`}
      >
        <div className="fixed w-full max-w-[420px] rounded bg-white p-3 text-xl shadow-xl">
          {children}
        </div>
      </div>
    </>
  );
}
