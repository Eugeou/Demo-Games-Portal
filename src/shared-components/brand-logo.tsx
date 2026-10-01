type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = "h-7" }: BrandLogoProps) {
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <img
        src="/assets/brand/logo-light.png"
        alt="DND"
        className="h-full w-auto max-w-full object-contain object-left dark:hidden"
      />
      <img
        src="/assets/brand/logo-dark.png"
        alt="DND"
        className="hidden h-full w-auto max-w-full object-contain object-left dark:block"
      />
    </span>
  );
}
