export type JobField =
  | "Software Development"
  | "Backend Development"
  | "Frontend Development"
  | "Full Stack Development"
  | "Data Science"
  | "Artificial Intelligence"
  | "Machine Learning"
  | "Cybersecurity"
  | "Cloud & DevOps"
  | "UI/UX Design"
  | "Product Management"
  | "Other Fields";

export type JobType = "Full-time" | "Internship" | "Part-time" | "Contract";
export type WorkMode = "Remote" | "Hybrid" | "On-site";
export type ExperienceLevel = "Fresher" | "0-1 years" | "1-3 years" | "3-5 years" | "5+ years";

export interface Job {
  id: number;
  title: string;
  company: string;
  field: JobField;
  jobType: JobType;
  experience: ExperienceLevel;
  location: string;
  salary: string;
  workMode: WorkMode;
  skills: string[];
  applicationUrl: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
}
