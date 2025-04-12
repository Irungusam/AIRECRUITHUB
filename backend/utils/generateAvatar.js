import { createCanvas } from "canvas";

const generateAvatar = (text, size = 128) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Random background color
  const colors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Draw first letter
  ctx.fillStyle = "#ffffff";
  ctx.font = `${size * 0.6}px Sans`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), size / 2, size / 2);

  return canvas.toBuffer("image/png");
};

export default generateAvatar;
