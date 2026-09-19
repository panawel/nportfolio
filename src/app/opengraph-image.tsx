import { ImageResponse } from "next/og";
import { profile, heroStats } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const toneColor = { accent: "#0a0a0a", destructive: "#dc2626" } as const;
const toneBg = { accent: "#dbff00", destructive: "#fee2e2" } as const;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#ffffff",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#6b6b64",
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#0a0a0a", display: "flex" }} />
          {profile.role}
        </div>
        <div style={{ display: "flex", color: "#0a0a0a", fontSize: 100, fontWeight: 500, marginTop: 16 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", color: "#6b6b64", fontSize: 28, marginTop: 12 }}>
          also known as your friendly QA engineer
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 48 }}>
          {heroStats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "3px solid #0a0a0a",
                borderRadius: 20,
                padding: "20px 28px",
                background: "#ffffff",
                transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 40,
                  fontWeight: 700,
                  color: toneColor[stat.tone],
                  background: toneBg[stat.tone],
                  padding: "0 8px",
                  borderRadius: 8,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  color: "#6b6b64",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
