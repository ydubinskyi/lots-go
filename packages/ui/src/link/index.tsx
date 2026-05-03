import { createContext, useContext, type ComponentType, type ReactNode } from "react";

export interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  "aria-label"?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type LinkComponent = ComponentType<LinkProps>;

const LinkContext = createContext<LinkComponent | null>(null);

export function LinkProvider({
  component,
  children,
}: {
  component: LinkComponent;
  children: ReactNode;
}) {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>;
}

let warnedAboutMissingProvider = false;

export function Link(props: LinkProps) {
  const Impl = useContext(LinkContext);

  if (!Impl) {
    if (process.env.NODE_ENV !== "production" && !warnedAboutMissingProvider) {
      warnedAboutMissingProvider = true;
      console.warn(
        "[@lots-go/ui] <Link> was used without a <LinkProvider>. Falling back to <a>. " +
          "Wrap your app root with <LinkProvider component={...}> using your framework's link.",
      );
    }
    const { href, children, className, onClick } = props;
    return (
      <a href={href} className={className} aria-label={props["aria-label"]} onClick={onClick}>
        {children}
      </a>
    );
  }

  return <Impl {...props} />;
}
