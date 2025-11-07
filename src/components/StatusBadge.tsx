import { getStatusColor } from "../utils/formatter";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
}
