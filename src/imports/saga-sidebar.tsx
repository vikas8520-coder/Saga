import { useState } from "react";

const C = {
  bg: "#08090C",
  surface: "rgba(255,255,255,0.035)",
  surfaceHover: "rgba(255,255,255,0.06)",
  surfaceActive: "rgba(255,255,255,0.09)",
  border: "rgba(255,255,255,0.07)",
  text: "#E9ECF1",
  textMed: "#8B95A5",
  textDim: "#525C6A",
  blue: "#60A5FA",
};

const FONT = "'Outfit', 'DM Sans', system-ui, sans-serif";
const MONO = "'JetBrains Mono', monospace";

const navItems = [
  { id: "dash", label: "Dashboard", icon: "📊", key: "1" },
  { id: "crew", label: "Crew Board", icon: "👥", key: "2" },
  { id: "projects", label: "Projects", icon: "📁", key: "3" },
  { id: "sessions", label: "Sessions", icon: "🎰", key: "4" },
  { id: "revenue", label: "Revenue", icon: "💰", key: "5" },
  { id: "memory", label: "Memory", icon: "🧠", key: "6" },
];

export default function SagaSidebar() {
  const [active, setActive] = useState("dash");
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: FONT }}>

      {/* ─── SIDEBAR ─── */}
      <div
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{
          width: expanded ? 180 : 54,
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRight: `1px solid ${C.border}`,
          background: "rgba(8,9,12,0.6)",
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          padding: "10px 6px",
          gap: 2,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: expanded ? "6px 10px" : "6px 8px",
          marginBottom: 12, transition: "padding 0.25s",
          justifyContent: expanded ? "flex-start" : "center",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(96,165,250,0.3)",
          }}>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>S</span>
          </div>
          {expanded && (
            <span style={{
              fontSize: 14, fontWeight: 800, color: C.text,
              letterSpacing: "-0.02em", whiteSpace: "nowrap",
              opacity: expanded ? 1 : 0,
              transition: "opacity 0.2s ease 0.1s",
            }}>
              SAGA OS
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: C.border, margin: "0 8px 8px" }} />

        {/* Nav Items */}
        {navItems.map((n) => {
          const isActive = active === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: expanded ? "9px 12px" : "9px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                background: isActive ? C.surfaceActive : "transparent",
                color: isActive ? C.text : C.textMed,
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                fontFamily: FONT,
                transition: "all 0.15s ease",
                justifyContent: expanded ? "flex-start" : "center",
                position: "relative",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = C.surfaceHover;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div style={{
                  position: "absolute", left: 0, top: "20%",
                  height: "60%", width: 2.5,
                  background: C.blue, borderRadius: 2,
                }} />
              )}

              {/* Icon */}
              <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1 }}>{n.icon}</span>

              {/* Label — only visible when expanded */}
              {expanded && (
                <span style={{
                  overflow: "hidden", textOverflow: "ellipsis",
                  opacity: 1, transition: "opacity 0.15s ease 0.08s",
                }}>
                  {n.label}
                </span>
              )}

              {/* Keyboard shortcut — only visible when expanded */}
              {expanded && (
                <span style={{
                  marginLeft: "auto", fontSize: 9,
                  color: C.textDim, fontFamily: MONO,
                  background: "rgba(255,255,255,0.04)",
                  padding: "2px 5px", borderRadius: 4,
                  opacity: 1, transition: "opacity 0.15s ease 0.12s",
                }}>
                  {n.key}
                </span>
              )}
            </button>
          );
        })}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer hint — only when expanded */}
        {expanded && (
          <div style={{
            padding: "10px 12px", fontSize: 9,
            color: C.textDim, fontFamily: MONO,
            lineHeight: 1.7, borderTop: `1px solid ${C.border}`,
            marginTop: 8,
            opacity: 1, transition: "opacity 0.2s ease 0.15s",
          }}>
            Press <span style={{ color: C.textMed }}>1-6</span> to navigate
            <br />
            <span style={{ color: C.textMed }}>⌘K</span> for commands
          </div>
        )}
      </div>

      {/* ─── MAIN CONTENT AREA (placeholder) ─── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 40 }}>{navItems.find(n => n.id === active)?.icon}</span>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginTop: 8 }}>
            {navItems.find(n => n.id === active)?.label}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, fontFamily: MONO }}>
            Hover sidebar to expand · Click to navigate
          </div>
        </div>
      </div>
    </div>
  );
}