import type { SVGProps } from "react";

type BrandMarkProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  showWordmark?: boolean;
  label?: string;
};

export default function BrandMark({
  showWordmark = false,
  label,
  className = "",
  ...props
}: BrandMarkProps) {
  const accessibleProps = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <svg
      viewBox={showWordmark ? "0 0 214 48" : "0 0 48 48"}
      xmlns="http://www.w3.org/2000/svg"
      className={`brand-mark ${className}`.trim()}
      {...accessibleProps}
      {...props}
    >
      <g className="brand-mark__monogram">
        <path
          className="brand-mark__brackets"
          d="M18 10H11v28h7M30 10h7v28h-7"
        />
        <path className="brand-mark__slash" d="M29 8 19 40" />
      </g>
      {showWordmark && (
        <text
          className="brand-mark__wordmark"
          x="56"
          y="31"
          aria-hidden="true"
        >
          Mastery <tspan className="brand-mark__wordmark-accent">Hub</tspan>
        </text>
      )}
    </svg>
  );
}
