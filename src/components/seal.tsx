/** 朱红小方印：全站只出现两次（hero 与页脚），作为个人签名 */
export function Seal({
  label = "米",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex select-none items-center justify-center rounded-[3px] bg-primary font-serif leading-none text-primary-foreground ${className}`}
    >
      {label}
    </span>
  );
}
