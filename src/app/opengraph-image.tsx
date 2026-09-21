import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} - ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The link-preview image (WhatsApp, LinkedIn, ...): the site's hero colours, a lime sticker card on near-black.
// Chat apps crop it (a centred square or a wide strip), so the text is centred and everything fits in the middle square.
const LIME = "#dbff00";
const INK = "#0a0a0a";
const CARD = { width: 900, height: 420 };

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: INK,
        }}
      >
        <div style={{ display: "flex", position: "relative", ...CARD, transform: "rotate(-2deg)" }}>
          {/* The sticker's hard shadow, inverted for a dark background: a solid white block offset down and right. */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              ...CARD,
              borderRadius: 36,
              background: "#ffffff",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              ...CARD,
              borderRadius: 36,
              background: LIME,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 56px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignSelf: "center",
                background: INK,
                color: LIME,
                fontSize: 26,
                letterSpacing: 5,
                textTransform: "uppercase",
                padding: "10px 24px",
                borderRadius: 999,
              }}
            >
              {profile.role}
            </div>
            <div
              style={{
                display: "flex",
                color: INK,
                fontSize: 132,
                letterSpacing: -6,
                lineHeight: 1,
                marginTop: 30,
                // Geist Regular is the only weight bundled with ImageResponse; the stroke gives the name its weight.
                WebkitTextStroke: `4px ${INK}`,
              }}
            >
              {profile.name}
            </div>
            <div style={{ display: "flex", color: INK, fontSize: 30, marginTop: 26 }}>
              also known as your friendly QA engineer
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
