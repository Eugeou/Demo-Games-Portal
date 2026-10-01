import { COIN_ICON } from "@/domain/constants";

type CoinIconProps = {
  className?: string;
  alt?: string;
};

export default function CoinIcon({ className = "h-5 w-5", alt = "" }: CoinIconProps) {
  return <img src={COIN_ICON} alt={alt} className={`shrink-0 object-contain ${className}`} />;
}
