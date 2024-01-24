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
        }  fixed left-0 top-0 z-30 flex h-full w-full items-start justify-center transition-transform duration-400 ease-in-out`}
        onClick={close}
      >
        <div
          className="fixed max-h-[100svh] w-full max-w-[600px] overflow-auto bg-brand-white text-xl shadow-lg shadow-black"
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
