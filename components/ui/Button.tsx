import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "font-mono-label inline-flex items-center justify-center border-2 px-5 py-2.5 text-xs font-medium transition-none",
        "hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0",
        variant === "primary" &&
          "border-accent bg-accent text-accent-ink hover:bg-surface hover:text-accent",
        variant === "ghost" &&
          "border-line bg-transparent text-ink hover:border-accent hover:text-accent",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";