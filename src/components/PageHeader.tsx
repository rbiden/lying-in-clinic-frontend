export interface PageHeaderProps {
  header?: string
  description?: string
}

export const PageHeader = ({ header, description }: PageHeaderProps) => {
  if (!header && !description) return null

  return (
    <header>
      {header && (
        <h1 className="text-2xl font-heading text-primary font-bold sm:text-4xl">
          {header}
        </h1>
      )}
      {description && (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  )
}
