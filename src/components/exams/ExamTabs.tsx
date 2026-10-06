import { Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { ExamSectionName } from "@/types/exam";

interface ExamTabsProps {
  sections: ExamSectionName[];
  activeSection: ExamSectionName;
  onChange: (section: ExamSectionName) => void;
}

export default function ExamTabs({ sections, activeSection, onChange }: ExamTabsProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Tabs
      value={activeSection}
      onChange={(_, val) => onChange(val as ExamSectionName)}
      variant={isMobile ? "scrollable" : "scrollable"}
      scrollButtons="auto"
      sx={{
        "& .MuiTab-root": {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.92rem",
          minWidth: "auto",
          px: { xs: 1.75, sm: 2.5 },
          py: 1.2,
          color: dark ? "#94a3b8" : "#64748b",
          "&.Mui-selected": {
            color: "primary.main",
            fontWeight: 700,
          },
        },
        "& .MuiTabs-indicator": {
          backgroundColor: "primary.main",
          height: "3px",
          borderRadius: "3px 3px 0 0",
        },
      }}
    >
      {sections.map((section) => (
        <Tab key={section} label={section} value={section} />
      ))}
    </Tabs>
  );
}
