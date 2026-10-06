import { cn } from "cn";
import { formatStatus } from "./admin-format";

export default function StatusBadge({
  status,
  className,
  label,
}: {
  status: string;
  className: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        className,
      )}
    >
      {label ?? formatStatus(status)}
    </span>
  );
}
