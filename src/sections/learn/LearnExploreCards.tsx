import { Box, Button, Typography, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";

interface LearnExploreCardsProps {
  onSelectTrack: (track: "backend" | "chess" | "devops") => void;
}

export default function LearnExploreCards({ onSelectTrack }: LearnExploreCardsProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  // Muted sage-green accent replacing vivid #00b875
  const accent      = dark ? "#4fa888" : "#3a8c6e";
  const accentBg    = dark ? "rgba(79,168,136,0.10)"  : "rgba(58,140,110,0.07)";
  const accentBdr   = dark ? "rgba(79,168,136,0.22)"  : "rgba(58,140,110,0.18)";
  const accentHover = dark ? "#3d937a"                : "#2e7059";

  const cards = [
    {
      id: "backend" as const,
      num: "01",
      category: "SYSTEM DESIGN",
      title: "Backend Engineering",
      icon: "mdi:server-network",
      metrics: [
        { label: "5 Phases", icon: "mdi:layers-triple-outline" },
        { label: "31 Chapters", icon: "mdi:book-open-page-variant-outline" },
        { label: "160+ Lessons", icon: "mdi:school-outline" },
      ],
      ctaText: "Explore Pathway",
    },
    {
      id: "chess" as const,
      num: "02",
      category: "CHESS MASTERY",
      title: "Chess Basics & Strategy",
      icon: "mdi:chess-knight",
      metrics: [
        { label: "4 Stages", icon: "mdi:crown-outline" },
        { label: "14 Chapters", icon: "mdi:book-open-page-variant-outline" },
        { label: "60 Lessons", icon: "mdi:target" },
      ],
      ctaText: "Explore Pathway",
    },
    {
      id: "devops" as const,
      num: "03",
      category: "CLOUD & CI/CD",
      title: "DevOps & Cloud Engineering",
      icon: "mdi:cloud-sync-outline",
      metrics: [
        { label: "10 Phases", icon: "mdi:layers-triple-outline" },
        { label: "25 Chapters", icon: "mdi:book-open-page-variant-outline" },
        { label: "200+ Topics", icon: "mdi:school-outline" },
      ],
      ctaText: "Explore Pathway",
    },
  ];

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // Slightly warmer background — less harsh than pure #111
        backgroundColor: dark ? "#131416" : "#f4f6f8",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <Box sx={{ maxWidth: 1100, width: "100%", my: "auto" }}>
        {/* Header Badge */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1.25 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.45,
              borderRadius: "20px",
              backgroundColor: accentBg,
              border: `1px solid ${accentBdr}`,
            }}
          >
            {/* Static dot — no glow */}
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: accent,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: accent,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Interactive Learning Hub
            </Typography>
          </Box>
        </Box>

        {/* Title & Subtitle */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.7rem", sm: "2.05rem" },
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.25,
            color: dark ? "#e8eaf0" : "#1f2937",
            textAlign: "center",
            mb: 0.75,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Explore Learning Fields
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "0.88rem", sm: "0.95rem" },
            color: dark ? "#8d95a3" : "#6b7280",
            textAlign: "center",
            maxWidth: 480,
            mx: "auto",
            mb: { xs: 3, sm: 4 },
            lineHeight: 1.55,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Select a field to begin learning.
        </Typography>

        {/* Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: { xs: 2, sm: 2.25 },
            width: "100%",
          }}
        >
          {cards.map((card) => (
            <Box
              key={card.id}
              onClick={() => onSelectTrack(card.id)}
              sx={{
                backgroundColor: dark ? "#1a1c20" : "#ffffff",
                border: "1px solid",
                borderColor: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                borderRadius: "14px",
                p: { xs: 2.5, sm: 3 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
                // Softer shadow
                boxShadow: dark
                  ? "0 2px 10px rgba(0,0,0,0.25)"
                  : "0 2px 10px rgba(0,0,0,0.03)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  borderColor: accent,
                  // Gentle glow — much less intense
                  boxShadow: dark
                    ? "0 8px 24px rgba(79,168,136,0.12)"
                    : "0 8px 24px rgba(58,140,110,0.09)",
                  "& .cta-btn": {
                    backgroundColor: accentHover,
                    boxShadow: "0 3px 10px rgba(79,168,136,0.22)",
                    "& .arrow-icon": {
                      transform: "translateX(3px)",
                    },
                  },
                  "& .num-badge": {
                    transform: "scale(1.04)",
                  },
                },
              }}
            >
              {/* Top Row: Icon + Big Number */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "11px",
                    backgroundColor: accentBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${accentBdr}`,
                  }}
                >
                  <Icon icon={card.icon} width={22} color={accent} />
                </Box>

                {/* ByteByteGo Big Chapter Number */}
                <Typography
                  className="num-badge"
                  sx={{
                    fontSize: "1.65rem",
                    fontWeight: 700,
                    color: dark ? "#6aab90" : "#4a9478",
                    lineHeight: 1,
                    fontFamily: "'Inter', sans-serif",
                    transition: "transform 0.2s ease",
                    opacity: 0.85,
                  }}
                >
                  {card.num}
                </Typography>
              </Box>

              {/* Category Tag */}
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: accent,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  mb: 0.5,
                  fontFamily: "'Inter', sans-serif",
                  opacity: 0.9,
                }}
              >
                {card.category}
              </Typography>

              {/* Title */}
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.15rem", sm: "1.3rem" },
                  fontWeight: 700,
                  letterSpacing: "-0.018em",
                  color: dark ? "#e2e6ee" : "#1f2937",
                  lineHeight: 1.3,
                  mb: 2,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {card.title}
              </Typography>

              {/* Metrics Row (Field Specific Info) */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 0.75,
                  mb: 3,
                }}
              >
                {card.metrics.map((m, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1.1,
                      py: 0.4,
                      borderRadius: "6px",
                      backgroundColor: dark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.025)",
                      border: "1px solid",
                      borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                    }}
                  >
                    <Icon icon={m.icon} width={13} color={accent} />
                    <Typography
                      sx={{
                        fontSize: "0.74rem",
                        fontWeight: 500,
                        color: dark ? "#b0bac8" : "#52606d",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {m.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Action Button */}
              <Button
                className="cta-btn"
                fullWidth
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTrack(card.id);
                }}
                endIcon={
                  <Icon
                    icon="mdi:arrow-right"
                    width={16}
                    className="arrow-icon"
                    style={{ transition: "transform 0.2s ease" }}
                  />
                }
                sx={{
                  textTransform: "none",
                  backgroundColor: accent,
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 0.95,
                  borderRadius: "8px",
                  // Gentler, less flashy shadow
                  boxShadow: "0 1px 4px rgba(79,168,136,0.18)",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: accentHover,
                    boxShadow: "0 3px 10px rgba(79,168,136,0.28)",
                  },
                }}
              >
                {card.ctaText}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
