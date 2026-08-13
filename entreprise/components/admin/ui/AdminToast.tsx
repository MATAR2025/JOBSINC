export default function AdminToast({ message, variant = 'info', onClose }: { message: string; variant?: 'success' | 'error' | 'warning' | 'info'; onClose?: () => void }) {
  return <div className={`admin-toast admin-toast-${variant}`} role="status"><span>{variant === 'success' ? '✓' : variant === 'error' ? '!' : '•'}</span><p>{message}</p>{onClose ? <button onClick={onClose} aria-label="Fermer">×</button> : null}</div>;
}
