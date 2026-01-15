import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-[#114C5A]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#114C5A]/20">
        <Inbox className="w-10 h-10 text-[#114C5A]" />
      </div>
      <p className="text-gray-600 text-base font-medium">{message}</p>
    </div>
  );
};

export default EmptyState;
