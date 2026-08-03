import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  overlay?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ message, overlay = false, size = 'md' }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader className={`animate-spin text-gold ${sizeMap[size]}`} />
      {message && <p className="text-sm text-text-secondary font-medium">{message}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
        {spinner}
      </div>
    );
  }

  return <div className="py-8 flex justify-center">{spinner}</div>;
}