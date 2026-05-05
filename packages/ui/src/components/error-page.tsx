import { Button } from "@lots-go/ui/components/button"
import { Link } from "@lots-go/ui/link"

interface ErrorPageProps {
  statusCode?: string | number
  title: string
  description: string
  homeLabel: string
  homeHref?: string
  tryAgainLabel?: string
  onReset?: () => void
  errorMessage?: string
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
  const showReset = Boolean(onReset && tryAgainLabel)

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="font-heading text-muted-foreground/40 text-7xl font-bold tracking-tight sm:text-8xl">
          {statusCode}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground max-w-md text-sm">{description}</p>
        {errorMessage ? (
          <pre className="bg-muted text-muted-foreground mt-2 max-w-xl overflow-auto rounded-md border px-3 py-2 text-left text-xs">
            {errorMessage}
          </pre>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {showReset ? <Button onClick={onReset}>{tryAgainLabel}</Button> : null}
        <Button variant={showReset ? "outline" : "default"} asChild>
          <Link href={homeHref}>{homeLabel}</Link>
        </Button>
      </div>
    </main>
  )
}
