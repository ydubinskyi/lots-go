import { Button } from "@lots-go/ui/components/button";
import { Link } from "@lots-go/ui/link";

interface ErrorPageProps {
  statusCode?: string | number;
  title: string;
  description: string;
  homeLabel: string;
  homeHref?: string;
  tryAgainLabel?: string;
  onReset?: () => void;
  errorMessage?: string;
}

export function ErrorPage({
  statusCode = 500,
  title,
  description,
  homeLabel,
  homeHref = "/",
  tryAgainLabel,
  onReset,
  errorMessage,
}: ErrorPageProps) {
  const showReset = Boolean(onReset && tryAgainLabel);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="font-heading text-7xl font-bold tracking-tight text-muted-foreground/40 sm:text-8xl">
          {statusCode}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        {errorMessage ? (
          <pre className="mt-2 max-w-xl overflow-auto rounded-md border bg-muted px-3 py-2 text-left text-xs text-muted-foreground">
            {errorMessage}
          </pre>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {showReset ? (
          <Button onClick={onReset}>{tryAgainLabel}</Button>
        ) : null}
        <Button variant={showReset ? "outline" : "default"} asChild>
          <Link href={homeHref}>{homeLabel}</Link>
        </Button>
      </div>
    </main>
  );
}
