export interface CourseSection {
  heading: string;
  bullets: string[];
  code?: string;
}

export interface CourseSubTopic {
  id: string;
  title: string;
  readTime: string;
  summary: string;
  sections: CourseSection[];
  keyTakeaway: string;
}

export interface CourseChapter {
  id: string;
  num: string;
  title: string;
  description?: string;
  subtopics: CourseSubTopic[];
}

export interface CoursePhase {
  id: string;
  phaseNum: string;
  title: string;
  description: string;
  chapters: CourseChapter[];
}

export interface RoadmapStage {
  stageNum: string;
  stageTitle: string;
  description: string;
  chapterIds: string[];
}

// Aliases for compatibility
export type SubTopic = CourseSubTopic;
export type Chapter = CourseChapter;
export type BackendSubTopic = CourseSubTopic;
export type BackendChapter = CourseChapter;
export type BackendPhase = CoursePhase;
export type DevOpsSubTopic = CourseSubTopic;
export type DevOpsChapter = CourseChapter;
export type DevOpsPhase = CoursePhase;
