import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  CoursePhase,
  CourseChapter,
  CourseSubTopic,
  RoadmapStage,
} from "@/types/learn";

const CONTENT_ROOT = path.join(process.cwd(), "content", "learn");

export function parseSubtopicMarkdown(
  fileContent: string,
  defaultId: string
): CourseSubTopic {
  const parsed = matter(fileContent);
  const data = parsed.data;
  const content = parsed.content;

  const id = data.id || defaultId;
  const title = data.title || "";
  const readTime = data.readTime || "";
  const summary = data.summary || "";
  const keyTakeaway = data.keyTakeaway || "";

  // Split content by "## " heading markers
  const sectionChunks = content.split(/\n(?=##\s)/g);
  const sections: CourseSubTopic["sections"] = [];

  for (const chunk of sectionChunks) {
    const trimmed = chunk.trim();
    if (!trimmed || !trimmed.startsWith("## ")) continue;

    const firstLineEnd = trimmed.indexOf("\n");
    let heading = "";
    let rest = "";

    if (firstLineEnd === -1) {
      heading = trimmed.replace(/^##\s+/, "").trim();
      rest = "";
    } else {
      heading = trimmed.slice(0, firstLineEnd).replace(/^##\s+/, "").trim();
      rest = trimmed.slice(firstLineEnd).trim();
    }

    let code: string | undefined = undefined;
    // Extract code blocks formatted as ``` ... ```
    const codeMatch = rest.match(/```[^\n]*\n([\s\S]*?)\n```/);
    if (codeMatch) {
      code = codeMatch[1];
      rest = rest.replace(/```[^\n]*\n[\s\S]*?\n```/, "").trim();
    }

    const bullets: string[] = [];
    const lines = rest.split("\n");
    for (const line of lines) {
      const lineTrim = line.trim();
      if (!lineTrim) continue;
      if (
        lineTrim.startsWith("- ") ||
        lineTrim.startsWith("* ") ||
        lineTrim.startsWith("• ")
      ) {
        bullets.push(lineTrim.replace(/^[-*•]\s+/, ""));
      } else {
        bullets.push(lineTrim);
      }
    }

    sections.push({
      heading,
      bullets,
      ...(code !== undefined ? { code } : {}),
    });
  }

  return {
    id,
    title,
    readTime,
    summary,
    sections,
    keyTakeaway,
  };
}

interface PhaseMeta {
  id: string;
  phaseNum: string;
  title: string;
  description: string;
  chapters: {
    id: string;
    num: string;
    title: string;
    subtopics: string[];
  }[];
}

export function loadTrackPhases(trackName: "backend" | "devops"): CoursePhase[] {
  const trackDir = path.join(CONTENT_ROOT, trackName);
  const metaPath = path.join(trackDir, "phases.json");

  if (!fs.existsSync(metaPath)) {
    return [];
  }

  const rawMeta = fs.readFileSync(metaPath, "utf-8");
  const phasesMeta: PhaseMeta[] = JSON.parse(rawMeta);

  return phasesMeta.map((phase) => {
    const chapters: CourseChapter[] = phase.chapters.map((ch) => {
      const subtopics: CourseSubTopic[] = ch.subtopics.map((subId) => {
        const mdPath = path.join(trackDir, phase.id, ch.id, `${subId}.md`);
        if (fs.existsSync(mdPath)) {
          const content = fs.readFileSync(mdPath, "utf-8");
          return parseSubtopicMarkdown(content, subId);
        }
        return {
          id: subId,
          title: subId,
          readTime: "1 min",
          summary: "",
          sections: [],
          keyTakeaway: "",
        };
      });

      return {
        id: ch.id,
        num: ch.num,
        title: ch.title,
        subtopics,
      };
    });

    return {
      id: phase.id,
      phaseNum: phase.phaseNum,
      title: phase.title,
      description: phase.description,
      chapters,
    };
  });
}

interface ChessMeta {
  stages: RoadmapStage[];
  chapters: {
    id: string;
    num: string;
    title: string;
    description: string;
    subtopics: string[];
  }[];
}

export function loadChessContent(): {
  stages: RoadmapStage[];
  chapters: CourseChapter[];
} {
  const chessDir = path.join(CONTENT_ROOT, "chess");
  const metaPath = path.join(chessDir, "roadmap.json");

  if (!fs.existsSync(metaPath)) {
    return { stages: [], chapters: [] };
  }

  const rawMeta = fs.readFileSync(metaPath, "utf-8");
  const chessMeta: ChessMeta = JSON.parse(rawMeta);

  const chapters: CourseChapter[] = chessMeta.chapters.map((ch) => {
    const subtopics: CourseSubTopic[] = ch.subtopics.map((subId) => {
      const mdPath = path.join(chessDir, ch.id, `${subId}.md`);
      if (fs.existsSync(mdPath)) {
        const content = fs.readFileSync(mdPath, "utf-8");
        return parseSubtopicMarkdown(content, subId);
      }
      return {
        id: subId,
        title: subId,
        readTime: "1 min",
        summary: "",
        sections: [],
        keyTakeaway: "",
      };
    });

    return {
      id: ch.id,
      num: ch.num,
      title: ch.title,
      description: ch.description,
      subtopics,
    };
  });

  return {
    stages: chessMeta.stages,
    chapters,
  };
}

export function loadAllLearnContent() {
  const backendPhases = loadTrackPhases("backend");
  const devopsPhases = loadTrackPhases("devops");
  const { stages: chessStages, chapters: chessChapters } = loadChessContent();

  return {
    backendPhases,
    devopsPhases,
    chessStages,
    chessChapters,
  };
}
