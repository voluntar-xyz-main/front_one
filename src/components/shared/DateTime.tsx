import { format } from "date-fns";
import { Calendar, Clock, LucideIcon } from "lucide-react";
import { FC } from "react";

interface DateTimeProps {
  date?: string | Date | null;
  format?: string;
  prefix?: string;
  suffix?: string;
  icon?: LucideIcon;
  className?: string;
}

export const DateTime: FC<DateTimeProps> = ({
  date,
  format: formatStr = "MMM d, yyyy",
  prefix = "",
  suffix = "",
  icon: Icon = Calendar,
  className = "text-sm text-gray-500",
}) => {
  if (!date) return null;

  const formattedDate = format(new Date(date), formatStr);

  return (
    <span className={`flex items-center ${className}`}>
      <Icon className="w-4 h-4 mr-1" />
      {prefix && <span className="mr-1">{prefix}</span>}
      {formattedDate}
      {suffix && <span className="ml-1">{suffix}</span>}
    </span>
  );
};

export const Duration: FC<
  Omit<DateTimeProps, "format"> & { duration: string }
> = ({
  duration,
  icon: Icon = Clock,
  className = "text-sm text-green-600 font-bold",
  ...props
}) => {
  if (!duration) return null;

  return (
    <span className={`flex items-center ${className}`}>
      <Icon className="w-4 h-4 mr-1" />
      {duration}
    </span>
  );
};
