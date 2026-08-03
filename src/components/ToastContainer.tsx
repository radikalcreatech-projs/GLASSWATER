import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import type { ToastType } from '../types';

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap: Record<ToastType, string> = {
  success: 'border-green-400 bg-green-50 text-green-800',
  error: 'border-red-400 bg-red-50 text-red-800',
  warning: 'border-yellow-400 bg-yellow-50 text-yellow-800',
  info: 'border-blue-400 bg-blue-50 text-blue-800',
};

const iconColorMap: Record<ToastType, string> = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[4000] flex flex-col-reverse gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-lg p-4 shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-right-4 duration-300 ${colorMap[toast.type]}`}
            role="alert"
          >
            <Icon size={20} className={`shrink-0 mt-0.5 ${iconColorMap[toast.type]}`} />
            <span className="text-sm font-medium flex-1 leading-snug">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-2 cursor-pointer"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}