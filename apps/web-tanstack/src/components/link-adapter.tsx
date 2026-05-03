import { Link as TSRLink } from "@tanstack/react-router";
import type { LinkComponent, LinkProps } from "@lots-go/ui/link";

export const TanStackLinkAdapter: LinkComponent = ({
  href,
  children,
  className,
  prefetch,
  onClick,
  ...rest
}: LinkProps) => (
  <TSRLink
    to={href}
    className={className}
    preload={prefetch === false ? false : "intent"}
    onClick={onClick}
    aria-label={rest["aria-label"]}
  >
    {children}
  </TSRLink>
);
