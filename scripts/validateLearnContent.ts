import { loadAllLearnContent } from "../src/lib/learnContentLoader";

function validate() {
  console.log("Validating all Learn content from markdown files...");
  const { backendPhases, devopsPhases, chessStages, chessChapters } =
    loadAllLearnContent();

  console.log(`Backend: ${backendPhases.length} phases loaded`);
  let backendLessons = 0;
  backendPhases.forEach((p) =>
    p.chapters.forEach((c) => {
      backendLessons += c.subtopics.length;
    })
  );
  console.log(`  -> ${backendLessons} total lessons`);

  console.log(`DevOps: ${devopsPhases.length} phases loaded`);
  let devopsLessons = 0;
  devopsPhases.forEach((p) =>
    p.chapters.forEach((c) => {
      devopsLessons += c.subtopics.length;
    })
  );
  console.log(`  -> ${devopsLessons} total lessons`);

  console.log(`Chess: ${chessStages.length} stages, ${chessChapters.length} chapters loaded`);
  let chessLessons = 0;
  chessChapters.forEach((c) => {
    chessLessons += c.subtopics.length;
  });
  console.log(`  -> ${chessLessons} total lessons`);

  if (backendPhases.length === 5 && devopsPhases.length === 10 && chessChapters.length === 14) {
    console.log("✅ All Learn content loaded and validated successfully!");
  } else {
    console.error("❌ Content count mismatch!");
    process.exit(1);
  }
}

validate();
