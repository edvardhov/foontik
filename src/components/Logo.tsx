import logoDark from '../assets/foontik-dark.svg'
import logoLight from '../assets/foontik-light.svg'

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
  alt?: string
}

export function Logo({ variant = 'dark', className, alt = 'Foontik' }: LogoProps) {
  const src = variant === 'dark' ? logoDark : logoLight

  return <img src={src} alt={alt} className={className} draggable={false} />
}
