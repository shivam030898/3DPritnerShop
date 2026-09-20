import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm text-text-dim">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "h-11 rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text outline-none transition-colors placeholder:text-text-faint focus:border-text",
          className
        )}
        {...props}
      />
    </div>
  );
}
