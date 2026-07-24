import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Skyline — Premium Weather Forecast";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #030712 0%, #0a1a2f 55%, #030712 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.35)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            right: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(34,211,238,0.3)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 96,
              height: 96,
              borderRadius: 28,
              background: "linear-gradient(135deg, #3b82f6, #22d3ee)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
            }}
          >
            ☀️
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "white",
              letterSpacing: -2,
              display: "flex",
            }}
          >
            Skyline
            <span style={{ color: "#22d3ee" }}>.</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "#94a3b8",
            zIndex: 1,
            display: "flex",
          }}
        >
          Know the sky before you step out
        </div>
      </div>
    ),
    { ...size }
  );
}
