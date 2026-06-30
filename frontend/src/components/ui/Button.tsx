import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

type ButtonVariant = 'primary' | 'pill'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

export default function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const buttonClassName = ['ui-button', `ui-button-${variant}`, className].filter(Boolean).join(' ')

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  )
}
