// NavLink component from React Router with its prop types
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";

// React utility for forwarding refs
import { forwardRef } from "react";

// Utility function for conditionally merging class names
import { cn } from "@/lib/utils";

// Extended NavLink props to support legacy-style class names
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;        // Base class name
  activeClassName?: string;  // Class applied when route is active
  pendingClassName?: string; // Class applied when route is pending
}

// Wrapper component to provide activeClassName / pendingClassName support
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        // Dynamically compute class names based on route state
        className={({ isActive, isPending }) =>
          cn(
            className,
            isActive && activeClassName,
            isPending && pendingClassName
          )
        }
        {...props}
      />
    );
  },
);

// Helpful for debugging and React DevTools
NavLink.displayName = "NavLink";

// Export the compatibility NavLink
export { NavLink };
