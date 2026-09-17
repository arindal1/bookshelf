import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// PNG equivalent of app/icon.svg - apple-touch-icon requires a raster image.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 10,
          background: "#0a0a0b",
          padding: "36px 28px",
        }}
      >
        <div style={{ width: 22, height: 108, background: "#c6f84e" }} />
        <div style={{ width: 22, height: 132, background: "#c6f84e" }} />
        <div style={{ width: 22, height: 84, background: "#c6f84e" }} />
        <div style={{ width: 22, height: 56, background: "#c6f84e" }} />
      </div>
    ),
    { ...size }
  );
}