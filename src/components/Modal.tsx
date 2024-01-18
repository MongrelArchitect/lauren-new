import Blur from "./Blur";

interface Props {
  children: React.ReactNode;
  // comes from parent component, closes modal + resets any applicable state
  close?: () => void;
  visible: boolean;
}

export default function Modal({ children, close, visible }: Props) {
  return (
    <>
      {visible ? <Blur close={close} /> : null}
      <div
        className={`${
          visible ? null : "-translate-y-[100%]"
        }  absolute left-0 top-0 z-30 flex h-full w-full items-start justify-center transition-transform`}
        onClick={close}
      >
        <div
          className="fixed w-full max-w-[600px] max-h-[95svh] rounded bg-brand-white p-3 text-xl shadow-gray-500 shadow-lg"
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
