import styles from './Button.module.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  as: Component = 'button',
  className = '',
  ...rest
}) {
  return (
    <Component
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.full : ''} ${className}`}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 15 : 18} />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 15 : 18} />}
    </Component>
  )
}
