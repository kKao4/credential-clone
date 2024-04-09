import clsx from "clsx";
import { IoMdCheckmark } from "react-icons/io";

interface ButtonOptionProps extends React.ComponentProps<"button"> {
  isActive?: boolean
  text: string
}

export default function ButtonOption({ isActive = false, text, ...props }: ButtonOptionProps) {
  return (
    <button {...props} className="flex flex-row items-center text-0.8 w-full py-2.5 justify-evenly text-neutral-100 hover:bg-neutral-600 transition-400 text-start px-4">
      <IoMdCheckmark className={clsx("mr-1.5 text-1.25 transition-all", {
        "opacity-0": !isActive
      })} />
      <span className="w-full text-start select-none">{text}</span>
    </button>
  )
}