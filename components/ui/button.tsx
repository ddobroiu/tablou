import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: 'default' | 'outline' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        let baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

        let variantStyles = ""
        if (variant === 'default') variantStyles = "bg-slate-900 text-white hover:bg-slate-900/90"
        if (variant === 'outline') variantStyles = "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900"
        if (variant === 'ghost') variantStyles = "hover:bg-slate-100 hover:text-slate-900"
        if (variant === 'link') variantStyles = "text-primary underline-offset-4 hover:underline"

        let sizeStyles = ""
        if (size === 'default') sizeStyles = "h-10 px-4 py-2"
        if (size === 'sm') sizeStyles = "h-9 rounded-md px-3"
        if (size === 'lg') sizeStyles = "h-11 rounded-md px-8"
        if (size === 'icon') sizeStyles = "h-10 w-10"

        return (
            <Comp
                className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
