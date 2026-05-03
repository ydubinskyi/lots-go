import { Link as TSRLink, useParams } from "@tanstack/react-router";

import { DEFAULT_LOCALE } from "@lots-go/i18n";
import type { Locale } from "@lots-go/i18n";
import type { LinkComponent, LinkProps } from "@lots-go/ui/link";

export const TanStackLinkAdapter: LinkComponent = ({
  href,
  children,
  className,
  prefetch,
  onClick,
  ...rest
}: LinkProps) => {
  const params = useParams({ strict: false }) as { locale?: Locale };
  const locale = params.locale;
  const prefix = locale && locale !== DEFAULT_LOCALE ? `/${locale}` : "";
  const to = `${prefix}${href}`;

  return (
    <TSRLink
      to={to}
      className={className}
      preload={prefetch === false ? false : "intent"}
      onClick={onClick}
      aria-label={rest["aria-label"]}
    >
      {children}
    </TSRLink>
  );
};
