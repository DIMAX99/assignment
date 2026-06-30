import type { HTMLAttributes, ReactNode } from 'react'
import './Card.css'

type CardVariant = 'panel' | 'metric'

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  variant?: CardVariant
}

export default function Card({ children, className = '', variant = 'panel', ...props }: CardProps) {
  const cardClassName = ['ui-card', `ui-card-${variant}`, className].filter(Boolean).join(' ')

  return (
    <article className={cardClassName} {...props}>
      {children}
    </article>
  )
}
