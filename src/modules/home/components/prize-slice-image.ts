import { COIN_ICON } from "@/domain/constants";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export async function createPrizeSliceImage(amount: number) {
  const coin = await loadImage(COIN_ICON);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return COIN_ICON;
  }
  ctx.drawImage(coin, 48, 8, 160, 160);
  ctx.font = "800 72px Plus Jakarta Sans, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.fillStyle = "#ffffff";
  ctx.strokeText(String(amount), 128, 214);
  ctx.fillText(String(amount), 128, 214);
  return canvas.toDataURL("image/png");
}
