import clsx from "clsx"

interface ButtonIconProps extends React.ComponentProps<"button"> {
  children: React.ReactNode,
  isActive?: boolean
}

export default function ButtonIcon({ children, className, isActive = false, ...props }: ButtonIconProps) {
  return (
    <button
      {...props}
      className={clsx("size-8 rounded-full flex-none flex items-center justify-center transition-300 hover:bg-neutral-600 disabled:opacity-40 disabled:select-none disabled:hover:bg-transparent", {
        "bg-neutral-600": isActive
      }, className)}
    >
      {children}
    </button>
  )
}