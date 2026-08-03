import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-custom border border-red-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-navy mb-3">Something went wrong</h2>
        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
          An unexpected error occurred. Please try reloading the page. If the problem persists, contact support.
        </p>
        {error.message && (
          <details className="mb-6 text-left">
            <summary className="text-xs text-concrete-gray cursor-pointer hover:text-steel-blue transition-colors">
              Error details
            </summary>
            <pre className="mt-2 bg-light-gray p-3 rounded text-xs text-red-700 overflow-auto max-h-32 whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={resetError}
          className="bg-gold text-white px-8 py-3 rounded font-semibold uppercase tracking-widest text-sm hover:bg-navy transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={16} /> Reload Page
        </button>
      </div>
    </div>
  );
}