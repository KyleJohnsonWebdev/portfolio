import Link from 'next/link'
import type {ComponentProps, ReactNode} from 'react'

type Variant = 'primary' | 'secondary'

const base =
  'inline-flex min-h-target items-center justify-center rounded-md border px-5 font-medium no-underline transition-colors'

const variants: Record<Variant, string> = {
  // At most one primary per view.
  primary: 'border-transparent bg-accent text-on-accent hover:bg-ink hover:text-bg',
  secondary: 'border-border-strong bg-transparent text-ink hover:border-ink hover:text-ink',
}

type ButtonProps = {variant?: Variant; children: ReactNode} & (
  | ({href: string} & Omit<ComponentProps<typeof Link>, 'href' | 'className'>)
  | ({href?: undefined} & Omit<ComponentProps<'button'>, 'className'>)
)

/**
 * Renders a link when it navigates and a <button> when it acts. The label says what
 * happens: "See the work", "Download PDF".
 */
export default function Button({variant = 'secondary', children, ...props}: ButtonProps) {
  const className = `${base} ${variants[variant]}`
  if (props.href !== undefined) {
    return (
      <Link {...props} className={className}>
        {children}
      </Link>
    )
  }
  const {type = 'button', ...buttonProps} = props
  return (
    <button {...buttonProps} type={type} className={`${className} cursor-pointer`}>
      {children}
    </button>
  )
}
