import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #4a1a6b 50%, #1a1a2e 100%)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 24,
            background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
            marginBottom: 30,
          }}
        >
          <span style={{ fontSize: 60, color: "white" }}>Ξ</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #A78BFA, #F472B6)",
            backgroundClip: "text",
            color: "transparent",
            margin: 0,
            marginBottom: 16,
          }}
        >
          TipStream Pro
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: "#9CA3AF",
            margin: 0,
            marginBottom: 40,
          }}
        >
          Stream Tips • Stack Stats • Surge Rankings
        </p>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 24px",
              background: "rgba(139, 92, 246, 0.2)",
              borderRadius: 16,
              border: "1px solid rgba(139, 92, 246, 0.3)",
            }}
          >
            <span style={{ fontSize: 32 }}>💰</span>
            <span style={{ color: "#E9D5FF", fontSize: 20 }}>Micro Tips</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 24px",
              background: "rgba(236, 72, 153, 0.2)",
              borderRadius: 16,
              border: "1px solid rgba(236, 72, 153, 0.3)",
            }}
          >
            <span style={{ fontSize: 32 }}>🎨</span>
            <span style={{ color: "#FBCFE8", fontSize: 20 }}>NFT Receipts</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 24px",
              background: "rgba(59, 130, 246, 0.2)",
              borderRadius: 16,
              border: "1px solid rgba(59, 130, 246, 0.3)",
            }}
          >
            <span style={{ fontSize: 32 }}>✅</span>
            <span style={{ color: "#BFDBFE", fontSize: 20 }}>Daily Check-In</span>
          </div>
        </div>

        {/* Base Chain Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 40,
            padding: "12px 20px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 9999,
          }}
        >
          <span style={{ color: "#60A5FA", fontSize: 18 }}>Built on Base</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
