import { ComponentProps, ReactNode } from "react";

type InputProps = ComponentProps<"input"> & {
  label: string;
  prepend?: ReactNode;
  addon?: ReactNode;
};

export default function Input(props: InputProps) {
  return (
    <div className="rounded-[14px] bg-[#D9D9D933] py-2 px-5 relative">
      <label
        htmlFor={props.id}
        className="block text-sm text-secondary-600 mb-1"
      >
        {props.label}
      </label>

      <div className="flex gap-1">
        {props.prepend}

        <input
          {...props}
          className="border-none outline-none bg-transparent flex-1 text-secondary-800 font-medium"
        />
      </div>

      {props.addon ? (
        <div className="absolute inset-y-0 right-5 flex items-center text-secondary-800">
          {props.addon}
        </div>
      ) : null}
    </div>
  );
}
