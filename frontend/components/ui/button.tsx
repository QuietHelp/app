import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "outline" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", size = "md", variant = "default", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:border-gray-300",
      outline: "bg-transparent border border-white/20 text-white hover:bg-white/10",
      ghost: "bg-transparent text-white hover:bg-white/10",
    };

    return (
      <button
        className={`
          inline-flex items-center justify-center
          rounded-md font-medium
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:pointer-events-none
          transition-colors
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

