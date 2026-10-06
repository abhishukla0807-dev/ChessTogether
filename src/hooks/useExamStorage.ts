import { useCallback, useEffect, useState } from "react";
import { ExamProgress, SavedExam } from "@/types/exam";

const SAVED_EXAMS_KEY = "bytemate_saved_exams";
const EXAM_PROGRESS_KEY = "bytemate_exam_progress";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Hook for managing exam-related localStorage persistence:
 * saved exams, preparation progress, and attempt history.
 */
export function useExamStorage() {
  const [savedExams, setSavedExamsState] = useState<SavedExam[]>([]);
  const [progressMap, setProgressMapState] = useState<Record<string, ExamProgress>>({});

  // Hydrate from localStorage on mount
  useEffect(() => {
    setSavedExamsState(readJSON<SavedExam[]>(SAVED_EXAMS_KEY, []));
    setProgressMapState(readJSON<Record<string, ExamProgress>>(EXAM_PROGRESS_KEY, {}));
  }, []);

  // ── Saved Exams ──

  const isExamSaved = useCallback(
    (examId: string) => savedExams.some((s) => s.examId === examId),
    [savedExams]
  );

  const toggleSaveExam = useCallback(
    (examId: string) => {
      setSavedExamsState((prev) => {
        const exists = prev.some((s) => s.examId === examId);
        const next = exists
          ? prev.filter((s) => s.examId !== examId)
          : [...prev, { examId, savedAt: Date.now() }];
        writeJSON(SAVED_EXAMS_KEY, next);
        return next;
      });
    },
    []
  );

  // ── Exam Progress ──

  const getProgress = useCallback(
    (examId: string): ExamProgress | undefined => progressMap[examId],
    [progressMap]
  );

  const updateProgress = useCallback(
    (examId: string, update: Partial<ExamProgress>) => {
      setProgressMapState((prev) => {
        const existing = prev[examId] ?? {
          examId,
          questionsAttempted: 0,
          questionsCorrect: 0,
          mockTestsTaken: 0,
          lastAccessedAt: Date.now(),
          sectionsVisited: [],
        };
        const next = {
          ...prev,
          [examId]: { ...existing, ...update, lastAccessedAt: Date.now() },
        };
        writeJSON(EXAM_PROGRESS_KEY, next);
        return next;
      });
    },
    []
  );

  const recordSectionVisit = useCallback(
    (examId: string, section: string) => {
      setProgressMapState((prev) => {
        const existing = prev[examId] ?? {
          examId,
          questionsAttempted: 0,
          questionsCorrect: 0,
          mockTestsTaken: 0,
          lastAccessedAt: Date.now(),
          sectionsVisited: [],
        };
        const sections = existing.sectionsVisited.includes(section as never)
          ? existing.sectionsVisited
          : [...existing.sectionsVisited, section as never];
        const next = {
          ...prev,
          [examId]: { ...existing, sectionsVisited: sections, lastAccessedAt: Date.now() },
        };
        writeJSON(EXAM_PROGRESS_KEY, next);
        return next;
      });
    },
    []
  );

  // ── Recently Accessed (sorted by lastAccessedAt desc) ──
  const recentExamIds = Object.values(progressMap)
    .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
    .map((p) => p.examId);

  return {
    savedExams,
    isExamSaved,
    toggleSaveExam,
    progressMap,
    getProgress,
    updateProgress,
    recordSectionVisit,
    recentExamIds,
  };
}
