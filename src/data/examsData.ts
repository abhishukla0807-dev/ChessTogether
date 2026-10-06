import { Exam } from "@/types/exam";

const examsData: Exam[] = [
  /* ────────────────────────────────────────────────── GATE CS ── */
  {
    id: "gate-cs",
    name: "GATE CS",
    category: "Engineering",
    description: "Graduate Aptitude Test in Engineering — Computer Science & IT",
    fullDescription:
      "GATE CS/IT is a national-level examination that tests comprehensive understanding of undergraduate Computer Science and Information Technology subjects. Jointly conducted by IISc Bangalore and seven IITs, a valid GATE CS score is essential for admission to M.Tech/PhD programs in IITs, NITs, IIITs, and other top institutions, as well as for recruitment by PSUs such as ISRO, BARC, BHEL, DRDO, and several IT-sector companies.",
    sections: [
      "Syllabus",
      "Subjects",
      "Previous Year Papers",
      "Practice Questions",
      "Mock Tests",
      "Study Material",
    ],
    eligibility:
      "B.E./B.Tech/M.Sc./MCA in Computer Science, IT, or equivalent. Final-year students are also eligible.",
    pattern:
      "Online CBT — 65 questions (MCQ + NAT) for 100 marks. Duration: 3 hours. Negative marking of 1/3 for MCQs.",
    conductedBy: "IISc Bangalore & IITs",
    frequency: "Once a year (February)",
    subjects: [
      {
        id: "gate-cs-core",
        name: "Core Computer Science",
        topics: [
          "Programming & Data Structures",
          "Algorithms",
          "Theory of Computation",
          "Compiler Design",
          "Operating Systems",
          "Databases",
          "Computer Networks",
          "Computer Organization & Architecture",
          "Digital Logic",
        ],
        weightage: "~72% of total marks",
      },
      {
        id: "gate-cs-math",
        name: "Engineering Mathematics",
        topics: [
          "Discrete Mathematics",
          "Linear Algebra",
          "Probability & Statistics",
          "Calculus",
          "Combinatorics",
          "Graph Theory",
        ],
        weightage: "~13% of total marks",
      },
      {
        id: "gate-cs-ga",
        name: "General Aptitude",
        topics: [
          "Verbal Ability",
          "Quantitative Aptitude",
          "Analytical Reasoning",
          "Spatial Reasoning",
        ],
        weightage: "~15% of total marks",
      },
    ],
    papers: [
      { id: "gate-cs-2024", title: "GATE CS 2024", year: 2024, subject: "Computer Science" },
      { id: "gate-cs-2023", title: "GATE CS 2023", year: 2023, subject: "Computer Science" },
      { id: "gate-cs-2022", title: "GATE CS 2022", year: 2022, subject: "Computer Science" },
      { id: "gate-cs-2021", title: "GATE CS 2021", year: 2021, subject: "Computer Science" },
      { id: "gate-cs-2020", title: "GATE CS 2020", year: 2020, subject: "Computer Science" },
    ],
    questions: [
      {
        id: "gate-q1",
        question: "What is the time complexity of binary search on a sorted array of n elements?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctAnswer: 1,
        explanation: "Binary search divides the search interval in half at each step, giving O(log n) time complexity.",
        subject: "Algorithms",
      },
      {
        id: "gate-q2",
        question: "Which data structure is used in BFS traversal of a graph?",
        options: ["Stack", "Queue", "Priority Queue", "Deque"],
        correctAnswer: 1,
        explanation: "BFS uses a Queue (FIFO) to explore vertices level by level.",
        subject: "Data Structures",
      },
      {
        id: "gate-q3",
        question: "A process in a Unix-like OS calls fork(). How many processes exist after a successful fork?",
        options: ["1", "2", "3", "Depends on the system"],
        correctAnswer: 1,
        explanation: "fork() creates a child process, so after a successful call there are 2 processes (parent + child).",
        subject: "Operating Systems",
      },
      {
        id: "gate-q4",
        question: "The minimum number of edges in a connected graph with n vertices is:",
        options: ["n", "n-1", "n+1", "n/2"],
        correctAnswer: 1,
        explanation: "A tree is the minimum connected graph, and a tree with n vertices has exactly n-1 edges.",
        subject: "Discrete Mathematics",
      },
      {
        id: "gate-q5",
        question: "Which normal form eliminates transitive dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctAnswer: 2,
        explanation: "3NF eliminates transitive dependencies of non-prime attributes on the candidate key.",
        subject: "Databases",
      },
    ],
    mockTests: [
      { id: "gate-mt1", title: "GATE CS Full-Length Mock 1", duration: "3 hours", totalQuestions: 65 },
      { id: "gate-mt2", title: "GATE CS Full-Length Mock 2", duration: "3 hours", totalQuestions: 65 },
      { id: "gate-mt3", title: "GATE CS Topic-wise: Algorithms", duration: "1 hour", totalQuestions: 20 },
      { id: "gate-mt4", title: "GATE CS Topic-wise: DBMS", duration: "1 hour", totalQuestions: 20 },
      { id: "gate-mt5", title: "GATE CS Topic-wise: OS", duration: "1 hour", totalQuestions: 20 },
    ],
    studyMaterials: [
      { id: "gate-sm1", title: "GATE CS Complete Study Notes", type: "notes" },
      { id: "gate-sm2", title: "Algorithms — Comprehensive Guide", type: "notes" },
      { id: "gate-sm3", title: "Operating Systems — Key Concepts", type: "notes" },
      { id: "gate-sm4", title: "DBMS — Normalization & Transactions", type: "notes" },
      { id: "gate-sm5", title: "Computer Networks — Protocols & Layers", type: "notes" },
    ],
  },

  /* ────────────────────────────────────────────────── ISRO SC ── */
  {
    id: "isro-sc",
    name: "ISRO Scientist/Engineer SC",
    category: "Research & Space",
    description: "ISRO Scientist/Engineer 'SC' — Computer Science stream",
    fullDescription:
      "ISRO conducts the Scientist/Engineer 'SC' examination to recruit engineers in the Computer Science stream for its various centres (VSSC, ISAC, SAC, SDSC, LEOS, etc.). The exam tests core CS fundamentals and is highly competitive. Selected candidates work on satellite software, launch vehicle systems, mission control, and space research applications.",
    sections: [
      "Syllabus",
      "Subjects",
      "Previous Year Papers",
      "Practice Questions",
      "Mock Tests",
      "Study Material",
    ],
    eligibility:
      "B.E./B.Tech in Computer Science, IT, or equivalent with minimum 65% (First Class) or CGPA 6.84/10. Age: ≤28 years.",
    pattern:
      "Written test — 80 objective questions for 320 marks. Duration: 90 minutes. Negative marking of 1 mark per wrong answer. Followed by interview.",
    conductedBy: "Indian Space Research Organisation (ISRO)",
    frequency: "As per vacancies (typically once a year)",
    subjects: [
      {
        id: "isro-cs-core",
        name: "Computer Science Fundamentals",
        topics: [
          "Data Structures & Algorithms",
          "Operating Systems",
          "Computer Networks",
          "Database Management Systems",
          "Theory of Computation",
          "Compiler Design",
          "Computer Organization & Architecture",
          "Software Engineering",
        ],
        weightage: "~70% of total marks",
      },
      {
        id: "isro-cs-prog",
        name: "Programming & Languages",
        topics: [
          "C Programming",
          "Object-Oriented Programming",
          "Java/C++ Concepts",
          "Data Types & Pointers",
          "Memory Management",
        ],
        weightage: "~15% of total marks",
      },
      {
        id: "isro-cs-math",
        name: "Mathematics & Aptitude",
        topics: [
          "Discrete Mathematics",
          "Linear Algebra",
          "Probability",
          "Numerical Methods",
          "Logical Reasoning",
        ],
        weightage: "~15% of total marks",
      },
    ],
    papers: [
      { id: "isro-cs-2024", title: "ISRO SC CS 2024", year: 2024 },
      { id: "isro-cs-2023", title: "ISRO SC CS 2023", year: 2023 },
      { id: "isro-cs-2022", title: "ISRO SC CS 2022", year: 2022 },
      { id: "isro-cs-2020", title: "ISRO SC CS 2020", year: 2020 },
    ],
    questions: [
      {
        id: "isro-q1",
        question: "Which of the following page replacement algorithms suffers from Belady's anomaly?",
        options: ["LRU", "FIFO", "Optimal", "LFU"],
        correctAnswer: 1,
        explanation: "FIFO page replacement can suffer from Belady's anomaly where increasing the number of page frames can increase page faults.",
        subject: "Operating Systems",
      },
      {
        id: "isro-q2",
        question: "In TCP, the congestion window size after a timeout event is reset to:",
        options: ["0", "1 MSS", "Half of previous value", "Threshold value"],
        correctAnswer: 1,
        explanation: "After a timeout, TCP resets the congestion window to 1 MSS (Maximum Segment Size) and enters slow-start phase.",
        subject: "Computer Networks",
      },
      {
        id: "isro-q3",
        question: "What is the output of sizeof(int *) on a 64-bit machine?",
        options: ["2", "4", "8", "Depends on compiler"],
        correctAnswer: 2,
        explanation: "On a 64-bit machine, pointers are 8 bytes (64 bits) regardless of the data type they point to.",
        subject: "C Programming",
      },
    ],
    mockTests: [
      { id: "isro-mt1", title: "ISRO SC CS Full Mock 1", duration: "90 min", totalQuestions: 80 },
      { id: "isro-mt2", title: "ISRO SC CS Full Mock 2", duration: "90 min", totalQuestions: 80 },
      { id: "isro-mt3", title: "ISRO CS Topic-wise: Networks", duration: "45 min", totalQuestions: 25 },
    ],
    studyMaterials: [
      { id: "isro-sm1", title: "ISRO SC CS — Previous Year Analysis", type: "notes" },
      { id: "isro-sm2", title: "C Programming — Pointers & Memory", type: "notes" },
      { id: "isro-sm3", title: "Computer Architecture — ISRO Focus", type: "notes" },
    ],
  },

  /* ────────────────────────────────────────────────── BARC ── */
  {
    id: "barc-cs",
    name: "BARC OCES/DGFS",
    category: "Research & Space",
    description: "Bhabha Atomic Research Centre — Computer Science through GATE",
    fullDescription:
      "BARC recruits Scientific Officers through the OCES (Orientation Course for Engineering Graduates and Science Postgraduates) and DGFS (DAE Graduate Fellowship Scheme) programs. For Computer Science candidates, recruitment is based on a valid GATE CS score followed by an interview. Selected candidates undergo one year of training at BARC Training School, Anushaktinagar, Mumbai, and are then posted across DAE units for work in nuclear software systems, reactor control, scientific computing, and cybersecurity.",
    sections: [
      "Syllabus",
      "Subjects",
      "Previous Year Papers",
      "Practice Questions",
      "Mock Tests",
      "Study Material",
    ],
    eligibility:
      "B.E./B.Tech in Computer Science or IT with 60% marks. Must have a valid GATE score. Age: ≤26 years.",
    pattern:
      "Shortlisting via GATE CS score → BARC Interview (Technical + HR). The interview tests deep CS fundamentals, projects, and problem-solving.",
    conductedBy: "Bhabha Atomic Research Centre (DAE)",
    frequency: "Once a year (applications typically open in March–April)",
    subjects: [
      {
        id: "barc-cs-core",
        name: "Core Computer Science",
        topics: [
          "Data Structures & Algorithms",
          "Operating Systems",
          "Computer Networks",
          "Database Management Systems",
          "Computer Organization",
          "Compiler Design",
          "Theory of Computation",
        ],
        weightage: "GATE CS syllabus + interview depth",
      },
      {
        id: "barc-cs-interview",
        name: "Interview Focus Areas",
        topics: [
          "B.Tech Project Discussion",
          "System Design Basics",
          "OOP & Design Patterns",
          "Cybersecurity Fundamentals",
          "Scientific Computing",
          "Current Technology Trends",
        ],
      },
    ],
    papers: [
      { id: "barc-gate-2024", title: "BARC — Based on GATE CS 2024 cutoff", year: 2024 },
      { id: "barc-gate-2023", title: "BARC — Based on GATE CS 2023 cutoff", year: 2023 },
      { id: "barc-interview-2023", title: "BARC Interview Questions 2023 (CS)", year: 2023 },
    ],
    questions: [
      {
        id: "barc-q1",
        question: "Which of the following is NOT a deadlock handling strategy?",
        options: ["Prevention", "Avoidance", "Detection & Recovery", "Fragmentation"],
        correctAnswer: 3,
        explanation: "Fragmentation is a memory management concept, not a deadlock handling strategy. The four strategies are Prevention, Avoidance, Detection & Recovery, and Ignorance (Ostrich algorithm).",
        subject: "Operating Systems",
      },
      {
        id: "barc-q2",
        question: "In a B-tree of order m, the maximum number of keys in a node is:",
        options: ["m", "m-1", "m+1", "2m"],
        correctAnswer: 1,
        explanation: "A B-tree of order m can have at most m children and m-1 keys in each node.",
        subject: "Data Structures",
      },
    ],
    mockTests: [
      { id: "barc-mt1", title: "BARC CS Interview Prep — Mock 1", duration: "90 min", totalQuestions: 50 },
    ],
    studyMaterials: [
      { id: "barc-sm1", title: "BARC OCES — Interview Preparation Guide", type: "notes" },
      { id: "barc-sm2", title: "BARC CS — Previous Cutoff Analysis", type: "notes" },
    ],
  },

  /* ────────────────────────────────────────────────── SEBI ── */
  {
    id: "sebi-it",
    name: "SEBI Grade A (IT)",
    category: "Regulatory & Finance",
    description: "Securities and Exchange Board of India — Officer Grade A (Information Technology)",
    fullDescription:
      "SEBI recruits Officer Grade A in the Information Technology stream to manage its technology infrastructure, develop regulatory technology solutions, cybersecurity, data analytics, and digital surveillance of securities markets. The exam is conducted in three phases: Phase I (screening), Phase II (descriptive + MCQ), and Phase III (interview). It is a highly coveted regulatory body position with excellent compensation.",
    sections: [
      "Syllabus",
      "Subjects",
      "Previous Year Papers",
      "Practice Questions",
      "Mock Tests",
      "Study Material",
    ],
    eligibility:
      "B.E./B.Tech in Computer Science, IT, Electronics, or equivalent with 60% marks. Minimum 1 year IT experience OR M.Tech in CS/IT. Age: ≤30 years.",
    pattern:
      "Phase I: 100 MCQ (General Awareness, English, Quantitative, Reasoning, IT) — 120 min. Phase II: IT paper (MCQ + Descriptive). Phase III: Interview.",
    conductedBy: "Securities and Exchange Board of India (SEBI)",
    frequency: "As per vacancies (typically once a year)",
    subjects: [
      {
        id: "sebi-it-core",
        name: "Information Technology",
        topics: [
          "Database Management Systems",
          "Networking & Security",
          "Operating Systems",
          "Software Engineering",
          "Web Technologies",
          "Cloud Computing",
          "Data Analytics",
          "Cybersecurity",
          "Information Security Standards",
        ],
        weightage: "~50% of Phase II",
      },
      {
        id: "sebi-it-prog",
        name: "Programming & Development",
        topics: [
          "Data Structures & Algorithms",
          "Object-Oriented Programming",
          "System Design",
          "Agile & DevOps",
          "API Design & REST",
        ],
      },
      {
        id: "sebi-it-phase1",
        name: "Phase I — General",
        topics: [
          "General Awareness",
          "English Language",
          "Quantitative Aptitude",
          "Reasoning Ability",
          "IT Basics",
        ],
        weightage: "Phase I screening",
      },
    ],
    papers: [
      { id: "sebi-it-2024", title: "SEBI Grade A IT Phase II 2024", year: 2024 },
      { id: "sebi-it-2023", title: "SEBI Grade A IT Phase II 2023", year: 2023 },
      { id: "sebi-it-2022", title: "SEBI Grade A IT Phase II 2022", year: 2022 },
    ],
    questions: [
      {
        id: "sebi-q1",
        question: "Which ISO standard deals with Information Security Management Systems (ISMS)?",
        options: ["ISO 9001", "ISO 14001", "ISO 27001", "ISO 22301"],
        correctAnswer: 2,
        explanation: "ISO/IEC 27001 specifies requirements for establishing, implementing, maintaining, and continually improving an ISMS.",
        subject: "Information Security",
      },
      {
        id: "sebi-q2",
        question: "In the context of cloud computing, IaaS stands for:",
        options: [
          "Internet as a Service",
          "Infrastructure as a Service",
          "Integration as a Service",
          "Information as a Service",
        ],
        correctAnswer: 1,
        explanation: "IaaS (Infrastructure as a Service) provides virtualized computing resources over the internet.",
        subject: "Cloud Computing",
      },
      {
        id: "sebi-q3",
        question: "What does the CIA triad stand for in cybersecurity?",
        options: [
          "Control, Integrity, Authentication",
          "Confidentiality, Integrity, Availability",
          "Confidentiality, Integration, Authorization",
          "Control, Integration, Availability",
        ],
        correctAnswer: 1,
        explanation: "The CIA triad — Confidentiality, Integrity, and Availability — is the foundational model for information security.",
        subject: "Cybersecurity",
      },
    ],
    mockTests: [
      { id: "sebi-mt1", title: "SEBI Grade A IT Phase I Mock", duration: "120 min", totalQuestions: 100 },
      { id: "sebi-mt2", title: "SEBI Grade A IT Phase II Mock", duration: "120 min", totalQuestions: 50 },
    ],
    studyMaterials: [
      { id: "sebi-sm1", title: "SEBI IT — Complete Preparation Guide", type: "notes" },
      { id: "sebi-sm2", title: "Cybersecurity & InfoSec Standards", type: "notes" },
      { id: "sebi-sm3", title: "Cloud Computing & Networking for SEBI IT", type: "notes" },
    ],
  },

  /* ────────────────────────────────────────────────── DRDO ── */
  {
    id: "drdo-cs",
    name: "DRDO SET (CS)",
    category: "Defence & PSU",
    description: "Defence Research & Development Organisation — Scientist 'B' (Computer Science)",
    fullDescription:
      "DRDO conducts the Scientist Entry Test (SET) to recruit Scientist 'B' in the Computer Science discipline. Selected candidates work on defence technology projects including AI/ML for defence, communication systems, cybersecurity, embedded systems, and strategic computing at labs across India (CAIR, DEAL, LRDE, etc.).",
    sections: [
      "Syllabus",
      "Subjects",
      "Previous Year Papers",
      "Practice Questions",
      "Mock Tests",
      "Study Material",
    ],
    eligibility:
      "B.E./B.Tech in Computer Science or IT with minimum 60% marks (First Division). Age: ≤28 years.",
    pattern:
      "Written Test — 150 objective questions for 300 marks. Section A: CS discipline (100Q, 200 marks). Section B: General Ability (50Q, 100 marks). Duration: 3 hours. Negative marking of 1 mark.",
    conductedBy: "Defence Research & Development Organisation (DRDO)",
    frequency: "As per vacancies",
    subjects: [
      {
        id: "drdo-cs-core",
        name: "Computer Science (Section A)",
        topics: [
          "Data Structures & Algorithms",
          "Computer Organization & Architecture",
          "Operating Systems",
          "Computer Networks",
          "Database Management Systems",
          "Compiler Design",
          "Theory of Computation & Automata",
          "Software Engineering",
          "Digital Logic & Microprocessors",
          "Artificial Intelligence Basics",
        ],
        weightage: "200 marks (Section A)",
      },
      {
        id: "drdo-cs-ga",
        name: "General Ability (Section B)",
        topics: [
          "Quantitative Aptitude",
          "English",
          "General Science",
          "Current Affairs",
          "Reasoning & Logical Ability",
        ],
        weightage: "100 marks (Section B)",
      },
    ],
    papers: [
      { id: "drdo-cs-2024", title: "DRDO SET CS 2024", year: 2024 },
      { id: "drdo-cs-2022", title: "DRDO SET CS 2022", year: 2022 },
      { id: "drdo-cs-2020", title: "DRDO SET CS 2020", year: 2020 },
    ],
    questions: [
      {
        id: "drdo-q1",
        question: "The worst-case time complexity of quicksort is:",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        correctAnswer: 1,
        explanation: "Quicksort degrades to O(n²) when the pivot selection consistently results in the most unbalanced partitions (e.g., sorted input with first element as pivot).",
        subject: "Algorithms",
      },
      {
        id: "drdo-q2",
        question: "Which addressing mode uses the content of a register as the memory address of the operand?",
        options: ["Immediate", "Direct", "Register Indirect", "Indexed"],
        correctAnswer: 2,
        explanation: "In Register Indirect addressing, the register contains the memory address where the operand is stored.",
        subject: "Computer Organization",
      },
    ],
    mockTests: [
      { id: "drdo-mt1", title: "DRDO SET CS Full Mock", duration: "3 hours", totalQuestions: 150 },
      { id: "drdo-mt2", title: "DRDO CS Section A Mock", duration: "2 hours", totalQuestions: 100 },
    ],
    studyMaterials: [
      { id: "drdo-sm1", title: "DRDO SET CS — Complete Guide", type: "notes" },
      { id: "drdo-sm2", title: "Computer Organization for DRDO/ISRO", type: "notes" },
    ],
  },

  /* ────────────────────────────────────────────────── NIC ── */
  {
    id: "nic-sas",
    name: "NIC Scientist B",
    category: "IT & Government",
    description: "National Informatics Centre — Scientist 'B' (Computer Science)",
    fullDescription:
      "NIC (National Informatics Centre) under MeitY recruits Scientist 'B' through a written exam and interview. NIC is the premier IT organization of the Government of India, providing ICT infrastructure and e-governance solutions. Scientist 'B' officers work on national-level digital platforms, network infrastructure (NICNET), cloud services (MeghRaj), cybersecurity, and software development for government applications.",
    sections: [
      "Syllabus",
      "Subjects",
      "Previous Year Papers",
      "Practice Questions",
      "Mock Tests",
      "Study Material",
    ],
    eligibility:
      "B.E./B.Tech in Computer Science, IT, Electronics, or MCA with 60% marks. Age: ≤30 years.",
    pattern:
      "Written Test: Paper I (General Ability — 100 marks) + Paper II (CS/IT — 200 marks). Duration: 2 hours each. Followed by Interview (100 marks).",
    conductedBy: "National Informatics Centre (MeitY)",
    frequency: "As per vacancies",
    subjects: [
      {
        id: "nic-cs-core",
        name: "Computer Science & IT",
        topics: [
          "Data Structures & Algorithms",
          "DBMS & SQL",
          "Operating Systems",
          "Computer Networks & Internet Technologies",
          "Web Technologies (HTML, CSS, JS)",
          "Software Engineering & SDLC",
          "Cybersecurity & Information Security",
          "Cloud Computing & Virtualization",
          "E-Governance",
        ],
        weightage: "200 marks (Paper II)",
      },
      {
        id: "nic-cs-prog",
        name: "Programming & Development",
        topics: [
          "C/C++ Programming",
          "Java Programming",
          "Python Basics",
          "Object-Oriented Design",
          "RESTful APIs",
          "Mobile Application Concepts",
        ],
      },
      {
        id: "nic-cs-ga",
        name: "General Ability (Paper I)",
        topics: [
          "Reasoning & Logical Ability",
          "Quantitative Aptitude",
          "English Language",
          "General Awareness (IT, Science, Current Affairs)",
        ],
        weightage: "100 marks (Paper I)",
      },
    ],
    papers: [
      { id: "nic-2023", title: "NIC Scientist B 2023 (CS)", year: 2023 },
      { id: "nic-2020", title: "NIC Scientist B 2020 (CS)", year: 2020 },
      { id: "nic-2017", title: "NIC Scientist B 2017 (CS)", year: 2017 },
    ],
    questions: [
      {
        id: "nic-q1",
        question: "Which protocol is used for secure web communication?",
        options: ["HTTP", "FTP", "HTTPS", "SMTP"],
        correctAnswer: 2,
        explanation: "HTTPS (HTTP Secure) uses TLS/SSL encryption to provide secure communication over the web.",
        subject: "Computer Networks",
      },
      {
        id: "nic-q2",
        question: "In SQL, which command is used to remove all rows from a table without logging individual row deletions?",
        options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
        correctAnswer: 2,
        explanation: "TRUNCATE removes all rows from a table quickly without logging individual row deletions. Unlike DELETE, it cannot be rolled back in most RDBMS.",
        subject: "DBMS & SQL",
      },
    ],
    mockTests: [
      { id: "nic-mt1", title: "NIC Scientist B CS Full Mock", duration: "2 hours", totalQuestions: 100 },
    ],
    studyMaterials: [
      { id: "nic-sm1", title: "NIC Scientist B — Preparation Strategy", type: "notes" },
      { id: "nic-sm2", title: "E-Governance & Digital India Initiatives", type: "notes" },
    ],
  },

  /* ──────────────────────────────────────────────── NIELIT ── */
  {
    id: "nielit-sa",
    name: "NIELIT Scientist B",
    category: "IT & Government",
    description: "National Institute of Electronics & IT — Scientist 'B' (IT/CS)",
    fullDescription:
      "NIELIT (formerly DOEACC) conducts recruitment for Scientist 'B' and Scientific/Technical Assistant positions under MeitY. NIELIT is responsible for IT education, training, and capacity building across India. Scientist 'B' officers contribute to IT standards, digital literacy programs (PMGDISHA), IT security audits, and e-governance quality assurance.",
    sections: [
      "Syllabus",
      "Subjects",
      "Previous Year Papers",
      "Practice Questions",
      "Mock Tests",
      "Study Material",
    ],
    eligibility:
      "B.E./B.Tech in CS/IT/Electronics or MCA with 60% marks. Age: ≤30 years.",
    pattern:
      "Written Test: 100 objective questions (CS/IT + General Awareness). Duration: 2 hours. Followed by Interview.",
    conductedBy: "NIELIT (MeitY)",
    frequency: "As per vacancies",
    subjects: [
      {
        id: "nielit-cs",
        name: "Computer Science & IT",
        topics: [
          "Data Structures",
          "Algorithms",
          "Operating Systems",
          "Computer Networks",
          "DBMS",
          "Software Engineering",
          "Web Technologies",
          "Information Security",
          "Digital Electronics",
        ],
      },
      {
        id: "nielit-ga",
        name: "General Awareness & Aptitude",
        topics: [
          "IT & Cyber Laws",
          "E-Governance Policies",
          "Current Affairs",
          "Logical Reasoning",
          "Quantitative Aptitude",
        ],
      },
    ],
    papers: [
      { id: "nielit-2023", title: "NIELIT Scientist B 2023", year: 2023 },
      { id: "nielit-2021", title: "NIELIT Scientist B 2021", year: 2021 },
    ],
    questions: [
      {
        id: "nielit-q1",
        question: "The IT Act 2000 in India was amended in which year?",
        options: ["2005", "2008", "2010", "2012"],
        correctAnswer: 1,
        explanation: "The IT Act 2000 was significantly amended in 2008 (IT Amendment Act 2008) to address cybercrime, electronic signatures, and data protection.",
        subject: "IT & Cyber Laws",
      },
    ],
    mockTests: [
      { id: "nielit-mt1", title: "NIELIT Scientist B Full Mock", duration: "2 hours", totalQuestions: 100 },
    ],
    studyMaterials: [
      { id: "nielit-sm1", title: "NIELIT Scientist B — CS Preparation Notes", type: "notes" },
      { id: "nielit-sm2", title: "IT Act & Cyber Laws Summary", type: "notes" },
    ],
  },

  /* ────────────────────────────────────────────────── BEL ── */
  {
    id: "bel-pe",
    name: "BEL Probationary Engineer",
    category: "Defence & PSU",
    description: "Bharat Electronics Limited — Probationary Engineer (Computer Science)",
    fullDescription:
      "BEL, a Navratna PSU under the Ministry of Defence, recruits Probationary Engineers through GATE CS score. BEL works on defence electronics, radar systems, communications, electronic warfare, and C4I systems. Computer Science engineers develop embedded software, signal processing algorithms, network security systems, and enterprise IT solutions for defence applications.",
    sections: [
      "Syllabus",
      "Subjects",
      "Previous Year Papers",
      "Practice Questions",
      "Mock Tests",
      "Study Material",
    ],
    eligibility:
      "B.E./B.Tech in Computer Science or IT with 60% marks. Valid GATE CS score. Age: ≤25 years.",
    pattern:
      "Shortlisting through GATE CS score → BEL Interview (Technical + HR).",
    conductedBy: "Bharat Electronics Limited (BEL)",
    frequency: "Once a year (typically after GATE results)",
    subjects: [
      {
        id: "bel-cs-core",
        name: "Core CS (GATE syllabus)",
        topics: [
          "Data Structures & Algorithms",
          "Operating Systems",
          "Computer Networks",
          "DBMS",
          "Computer Organization",
          "Digital Logic",
          "Theory of Computation",
          "Compiler Design",
        ],
        weightage: "GATE CS score based",
      },
      {
        id: "bel-cs-interview",
        name: "Interview Topics",
        topics: [
          "Embedded Systems Basics",
          "Real-Time Operating Systems",
          "Network Security",
          "Software Development Lifecycle",
          "B.Tech Project Discussion",
        ],
      },
    ],
    papers: [
      { id: "bel-2024", title: "BEL — Based on GATE CS 2024", year: 2024 },
      { id: "bel-2023", title: "BEL — Based on GATE CS 2023", year: 2023 },
    ],
    questions: [
      {
        id: "bel-q1",
        question: "Which layer of the OSI model handles end-to-end error recovery and flow control?",
        options: ["Network", "Transport", "Session", "Data Link"],
        correctAnswer: 1,
        explanation: "The Transport layer (Layer 4) provides end-to-end error recovery, flow control, and reliable data transfer (e.g., TCP).",
        subject: "Computer Networks",
      },
    ],
    mockTests: [
      { id: "bel-mt1", title: "BEL Interview Prep Mock", duration: "60 min", totalQuestions: 40 },
    ],
    studyMaterials: [
      { id: "bel-sm1", title: "BEL Probationary Engineer — Interview Guide", type: "notes" },
      { id: "bel-sm2", title: "Embedded Systems & RTOS for PSUs", type: "notes" },
    ],
  },
];

export const EXAM_CATEGORIES = [
  "Engineering",
  "Research & Space",
  "Regulatory & Finance",
  "Defence & PSU",
  "IT & Government",
] as const;

export default examsData;
