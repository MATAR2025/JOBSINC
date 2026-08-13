'use client';

import AdminButton from './AdminButton';
import AdminModal from './AdminModal';

export default function AdminConfirmDialog({ open, title = 'Confirmer cette action', message, variant = 'danger', onCancel, onConfirm }: { open: boolean; title?: string; message: string; variant?: 'danger' | 'warning' | 'info'; onCancel: () => void; onConfirm: () => void }) {
  return <AdminModal open={open} title={title} onClose={onCancel} footer={<><AdminButton variant="ghost" onClick={onCancel}>Annuler</AdminButton><AdminButton variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>Confirmer</AdminButton></>}><p>{message}</p></AdminModal>;
}
