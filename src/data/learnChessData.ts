export interface SubTopic {
  id: string;
  title: string;
  readTime: string;
  summary: string;
  sections: {
    heading: string;
    bullets: string[];
  }[];
  keyTakeaway: string;
}

export interface Chapter {
  id: string;
  num: string;
  title: string;
  description: string;
  subtopics: SubTopic[];
}

export interface RoadmapStage {
  stageNum: string;
  stageTitle: string;
  description: string;
  chapterIds: string[];
}

export const CHESS_ROADMAP_STAGES: RoadmapStage[] = [
  {
    stageNum: "STAGE 1",
    stageTitle: "The Foundations",
    description: "Master the board, piece movements, special moves, and checkmate conditions.",
    chapterIds: ["01", "02", "03", "04"],
  },
  {
    stageNum: "STAGE 2",
    stageTitle: "Openings & Core Principles",
    description: "Learn center control, rapid piece development, and essential opening systems.",
    chapterIds: ["05", "06"],
  },
  {
    stageNum: "STAGE 3",
    stageTitle: "Tactics & Strategy",
    description: "Sharpen pattern recognition, tactical combinations, and positional planning.",
    chapterIds: ["07", "08", "09"],
  },
  {
    stageNum: "STAGE 4",
    stageTitle: "Endgames & Mastery",
    description: "Convert advantages, calculate variations, and build a long-term improvement regimen.",
    chapterIds: ["10", "11", "12", "13", "14"],
  },
];

export const CHESS_CHAPTERS: Chapter[] = [
  {
    id: "01",
    num: "01",
    title: "Chess Basics",
    description: "Understanding the battlefield, army composition, relative values, and notation.",
    subtopics: [
      {
        id: "board-coordinates",
        title: "Board & Coordinates",
        readTime: "2 min",
        summary: "The geometry of the 64-square battlefield, files, ranks, and coordinates.",
        sections: [
          {
            heading: "1. The 64-Square Grid",
            bullets: [
              "The chessboard is an 8x8 grid composed of 64 alternating light and dark squares.",
              "Setup Rule: 'White on the right' — the bottom-right corner square (h1 for White, a8 for Black) must always be a light-colored square.",
            ],
          },
          {
            heading: "2. Files, Ranks & Coordinates",
            bullets: [
              "Files: 8 vertical columns designated by lowercase letters from 'a' to 'h' (from White's left to right).",
              "Ranks: 8 horizontal rows designated by numbers from '1' to '8' (Rank 1 is White's back rank; Rank 8 is Black's back rank).",
              "Coordinates: Every square has a unique coordinate formed by its file letter followed by rank number (e.g. e4, d5, c3, f7).",
            ],
          },
          {
            heading: "3. Central Squares",
            bullets: [
              "The 4 central squares (d4, d5, e4, e5) form the most critical real estate on the board.",
              "Controlling the center gives your pieces maximum mobility, reach, and tactical power.",
            ],
          },
        ],
        keyTakeaway: "Always ensure the h1 corner square is white before starting, and orient your play around the center 4 squares.",
      },
      {
        id: "chess-pieces",
        title: "Chess Pieces",
        readTime: "2 min",
        summary: "The composition and initial setup of both armies on the board.",
        sections: [
          {
            heading: "1. The 32-Piece Army",
            bullets: [
              "Each player begins with 16 pieces: 1 King, 1 Queen, 2 Rooks, 2 Bishops, 2 Knights, and 8 Pawns.",
              "White always moves first, followed by Black in alternating turns.",
            ],
          },
          {
            heading: "2. Starting Placement",
            bullets: [
              "Back Ranks (Rank 1 for White, Rank 8 for Black): Rooks in corners (a1/h1, a8/h8), Knights next (b1/g1, b8/g8), Bishops next (c1/f1, c8/f8).",
              "Queen Placement Rule: 'Queen on her own color' — White Queen starts on d1 (light square), Black Queen starts on d8 (dark square).",
              "King Placement: Starts on the remaining central square (e1 for White, e8 for Black) directly next to the Queen.",
              "Front Ranks (Rank 2 for White, Rank 7 for Black): Row of 8 Pawns guarding the back rank.",
            ],
          },
        ],
        keyTakeaway: "Remember the golden setup rule: Queen on her own color (d-file), Rooks in the corners, and Pawns in front.",
      },
      {
        id: "piece-values",
        title: "Piece Values",
        readTime: "2 min",
        summary: "Standard point valuations used to evaluate exchanges and material balance.",
        sections: [
          {
            heading: "1. Numerical Point System",
            bullets: [
              "Pawn: 1 Point (The fundamental foot soldier).",
              "Knight: 3 Points (Minor piece, specialized in jumping and closed positions).",
              "Bishop: 3 Points (Minor piece, long-range sniper on its specific color diagonals).",
              "Rook: 5 Points (Major piece, controls open files and ranks).",
              "Queen: 9 Points (Major piece, the most powerful and versatile attacking force).",
              "King: Infinite / Priceless (Cannot be traded; losing the King ends the game).",
            ],
          },
          {
            heading: "2. Material Balance in Exchanges",
            bullets: [
              "Minor Piece Trade: Trading a Knight for a Bishop is an even material exchange (3 for 3).",
              "The Exchange: Trading a Minor Piece (3 pts) for a Rook (5 pts) is winning 'the exchange' (+2 point advantage).",
              "Queen Trade: Giving up two Rooks (10 pts) or 3 Minor pieces (9 pts) for an enemy Queen (9 pts) is roughly balanced depending on the position.",
            ],
          },
        ],
        keyTakeaway: "Use piece points as a compass during captures, but always weigh material against king safety and piece activity.",
      },
      {
        id: "chess-notation",
        title: "Chess Notation",
        readTime: "3 min",
        summary: "Standard Algebraic Notation (SAN) used to read, write, and record chess games.",
        sections: [
          {
            heading: "1. Piece Abbreviations",
            bullets: [
              "K = King, Q = Queen, R = Rook, B = Bishop, N = Knight (N is used to avoid confusion with King).",
              "Pawns have no letter prefix; only the destination square is written (e.g., 'e4', 'd5').",
            ],
          },
          {
            heading: "2. Move Symbols & Captures",
            bullets: [
              "x = Capture (e.g., 'Nxf3' means Knight captures on f3; 'exd5' means e-pawn captures on d5).",
              "+ = Check (e.g., 'Qh5+').",
              "# = Checkmate (e.g., 'Qxf7#').",
              "O-O = Kingside Castling (short castle).",
              "O-O-O = Queenside Castling (long castle).",
              "=Q = Pawn Promotion to Queen (e.g., 'e8=Q').",
            ],
          },
        ],
        keyTakeaway: "Algebraic notation is the universal language of chess. Mastering it allows you to analyze grandmaster games with ease.",
      },
    ],
  },
  {
    id: "02",
    num: "02",
    title: "Piece Movements",
    description: "Detailed movement mechanics, capture rules, and unique strengths of all 6 pieces.",
    subtopics: [
      {
        id: "king-movement",
        title: "King",
        readTime: "2 min",
        summary: "The most important piece on the board, its movement range, and safety requirements.",
        sections: [
          {
            heading: "1. Movement Mechanics",
            bullets: [
              "Moves exactly 1 square in any direction: horizontally, vertically, or diagonally.",
              "Captures enemy pieces by moving onto their square if that square is not defended by another enemy piece.",
            ],
          },
          {
            heading: "2. The Rule of Safety",
            bullets: [
              "The King can never move into a square that is currently under attack by an enemy piece (you cannot walk into Check).",
              "Kings must always remain at least one square away from each other; two Kings can never stand on adjacent squares.",
            ],
          },
        ],
        keyTakeaway: "Protect your King in the opening and middlegame, but activate him as an aggressive attacker in the endgame.",
      },
      {
        id: "queen-movement",
        title: "Queen",
        readTime: "2 min",
        summary: "The deadliest attacking piece combining the powers of Rook and Bishop.",
        sections: [
          {
            heading: "1. Movement & Reach",
            bullets: [
              "Moves any number of unoccupied squares in any straight line: horizontally, vertically, or diagonally.",
              "Combines the movement powers of a Rook and a Bishop into a single piece.",
            ],
          },
          {
            heading: "2. Tactical Usage",
            bullets: [
              "Cannot jump over other pieces; its path is blocked by both friendly and enemy units.",
              "Because of its high value (9 pts), bringing the Queen out too early in the opening makes her vulnerable to enemy attacks and development tempo loss.",
            ],
          },
        ],
        keyTakeaway: "The Queen is your most potent tactical weapon. Keep her safe early on and unleash her in coordinated attacks.",
      },
      {
        id: "rook-movement",
        title: "Rook",
        readTime: "2 min",
        summary: "The straight-line heavyweight controlling open files and the 7th rank.",
        sections: [
          {
            heading: "1. Movement Rules",
            bullets: [
              "Moves any number of unoccupied squares horizontally or vertically along ranks and files.",
              "Cannot jump over pieces; captures by occupying the enemy's square.",
            ],
          },
          {
            heading: "2. Ideal Positioning",
            bullets: [
              "Open Files: Rooks thrive on files that have no pawns blocking them.",
              "The 7th Rank (Pig on the 7th): A Rook placed on the opponent's 2nd rank (White's 7th rank) attacks enemy pawns and traps the King on the back rank.",
            ],
          },
        ],
        keyTakeaway: "Place Rooks on open files and connected pairs to dominate horizontal and vertical lines.",
      },
      {
        id: "bishop-movement",
        title: "Bishop",
        readTime: "2 min",
        summary: "The diagonal sniper locked permanently to its starting color complex.",
        sections: [
          {
            heading: "1. Diagonal Movement",
            bullets: [
              "Moves any number of unoccupied squares diagonally in any direction.",
              "Each player starts with one Light-Squared Bishop and one Dark-Squared Bishop. A Bishop can never change the color of squares it travels on.",
            ],
          },
          {
            heading: "2. The Bishop Pair",
            bullets: [
              "Having both Bishops ('The Bishop Pair') in open positions is a major positional advantage because together they control both color complexes.",
              "Good Bishop vs Bad Bishop: A Bishop whose diagonals are blocked by friendly pawns is a 'Bad Bishop'.",
            ],
          },
        ],
        keyTakeaway: "Keep diagonals open for your Bishops and preserve the Bishop pair in open board positions.",
      },
      {
        id: "knight-movement",
        title: "Knight",
        readTime: "2 min",
        summary: "The tricky jumper with an L-shaped leap that alternates square colors.",
        sections: [
          {
            heading: "1. The 'L' Movement",
            bullets: [
              "Moves in an 'L' shape: 2 squares in one cardinal direction, then 1 square perpendicular (or 1 square cardinal, then 2 perpendicular).",
              "The Jumping Ability: The Knight is the only piece on the chessboard that can jump over other pieces (both friendly and enemy).",
            ],
          },
          {
            heading: "2. Color Alternation & Outposts",
            bullets: [
              "Every move a Knight makes alternates its square color (from light to dark or dark to light).",
              "Knights excel in closed, crowded positions with locked pawn structures, especially when anchored on central outposts where enemy pawns cannot kick them.",
            ],
          },
        ],
        keyTakeaway: "A Knight on the rim is dim! Keep your Knights centralized where they command 8 squares instead of 4 or 2.",
      },
      {
        id: "pawn-movement",
        title: "Pawn",
        readTime: "2 min",
        summary: "The soul of chess with distinct movement, capture, and advancement rules.",
        sections: [
          {
            heading: "1. Forward Step & Initial Double Step",
            bullets: [
              "Moves forward 1 square at a time along its file. Pawns can never move or capture backward.",
              "Initial Double Step: On its very first move from its starting rank (Rank 2 for White, Rank 7 for Black), a pawn has the option to advance 2 squares forward.",
            ],
          },
          {
            heading: "2. Diagonal Capture",
            bullets: [
              "Pawns capture 1 square diagonally forward to the left or right.",
              "A pawn cannot capture straight ahead; if a piece is directly in front of it, the pawn is blocked.",
            ],
          },
        ],
        keyTakeaway: "Pawn moves cannot be taken back. Every pawn push creates permanent strengths and weaknesses behind it.",
      },
    ],
  },
  {
    id: "03",
    num: "03",
    title: "Special Moves",
    description: "The 3 special rules that every chess player must know: Castling, En Passant, and Promotion.",
    subtopics: [
      {
        id: "castling",
        title: "Castling",
        readTime: "3 min",
        summary: "The essential dual move to safeguard the King and activate the Rook.",
        sections: [
          {
            heading: "1. Mechanics (Kingside vs Queenside)",
            bullets: [
              "Kingside Castling (O-O): King moves 2 squares toward the h-file (e1 to g1 for White; e8 to g8 for Black). The h-Rook jumps to the f-file square (f1/f8).",
              "Queenside Castling (O-O-O): King moves 2 squares toward the a-file (e1 to c1 for White; e8 to c8 for Black). The a-Rook jumps to the d-file square (d1/d8).",
            ],
          },
          {
            heading: "2. Strict Legality Conditions",
            bullets: [
              "Neither the King nor the chosen Rook must have moved previously in the game.",
              "All squares between the King and the Rook must be completely vacant.",
              "The King cannot be currently in check, nor can it pass through or land on any square attacked by an enemy piece.",
            ],
          },
        ],
        keyTakeaway: "Castle early (usually within the first 10 moves) to tuck your King behind a wall of pawns.",
      },
      {
        id: "en-passant",
        title: "En Passant",
        readTime: "2 min",
        summary: "The French 'in passing' capture rule for two-square pawn advances.",
        sections: [
          {
            heading: "1. The En Passant Rule",
            bullets: [
              "When an opponent moves a pawn 2 squares forward from its starting rank and lands directly adjacent to your pawn on the 5th rank (for White) or 4th rank (for Black).",
              "You may capture that enemy pawn diagonally as if it had only moved 1 square forward.",
            ],
          },
          {
            heading: "2. Strict Timing Requirement",
            bullets: [
              "En Passant must be executed immediately on the very next turn. If you play any other move, the right to capture en passant on that pawn is permanently lost.",
            ],
          },
        ],
        keyTakeaway: "En passant prevents pawns from bypassing enemy pawn tension by jumping two squares.",
      },
      {
        id: "pawn-promotion",
        title: "Pawn Promotion",
        readTime: "2 min",
        summary: "Transforming a humble foot soldier into the most powerful piece on the 8th rank.",
        sections: [
          {
            heading: "1. Reaching the 8th Rank",
            bullets: [
              "When a White pawn reaches the 8th rank (or a Black pawn reaches the 1st rank), it immediately transforms into a Queen, Rook, Bishop, or Knight of the same color.",
              "You are not restricted to pieces that have been captured; you can have multiple Queens on the board simultaneously.",
            ],
          },
          {
            heading: "2. Underpromotion",
            bullets: [
              "Promoting to a piece other than a Queen is called 'Underpromotion'.",
              "Promoting to a Knight is often used to deliver an instant check or fork without causing stalemate.",
            ],
          },
        ],
        keyTakeaway: "Passed pawns must be pushed! A pawn reaching the 8th rank changes the outcome of the endgame.",
      },
    ],
  },
  {
    id: "04",
    num: "04",
    title: "Check & Checkmate",
    description: "The win conditions, check escape techniques, and the critical difference between Checkmate and Stalemate.",
    subtopics: [
      {
        id: "check",
        title: "Check",
        readTime: "2 min",
        summary: "When the King is under immediate threat and the 3 ways to escape (CPR).",
        sections: [
          {
            heading: "1. What is Check?",
            bullets: [
              "Check occurs when an enemy piece directly attacks your King.",
              "When in Check, you must immediately resolve the threat on that turn. You cannot ignore check or make any move that leaves your King in check.",
            ],
          },
          {
            heading: "2. The CPR Escape Rule",
            bullets: [
              "C = Capture the attacking piece with one of your own units.",
              "P = Protect (Block) the line of check by placing a piece between the attacker and your King (cannot block Knight checks).",
              "R = Run (Move) the King to an adjacent, unattacked square.",
            ],
          },
        ],
        keyTakeaway: "Whenever you are in check, remember CPR: Capture, Protect, or Run.",
      },
      {
        id: "checkmate",
        title: "Checkmate",
        readTime: "2 min",
        summary: "The ultimate victory condition where the King is in check with zero legal escapes.",
        sections: [
          {
            heading: "1. Defining Checkmate",
            bullets: [
              "Checkmate occurs when a King is in Check and none of the 3 CPR options (Capture, Protect, Run) are possible.",
              "The moment Checkmate is delivered, the game ends immediately as a victory for the attacking player. The King is never physically captured.",
            ],
          },
        ],
        keyTakeaway: "Checkmate is the sole objective in chess. Material advantage only matters if it leads to checkmate.",
      },
      {
        id: "stalemate",
        title: "Stalemate",
        readTime: "2 min",
        summary: "The tragic drawing trap where a player has no legal moves while NOT in check.",
        sections: [
          {
            heading: "1. Defining Stalemate",
            bullets: [
              "Stalemate occurs when the player whose turn it is has NO legal moves available anywhere on the board, and their King is NOT in check.",
              "Result: The game ends instantly in a Draw (1/2 - 1/2), regardless of how much material advantage either player has.",
            ],
          },
        ],
        keyTakeaway: "When winning with an overwhelming material advantage, always ensure the enemy King has at least one escape square before delivering non-check moves.",
      },
      {
        id: "draw-rules",
        title: "Draw Rules",
        readTime: "3 min",
        summary: "The 5 official ways a chess match concludes as a draw.",
        sections: [
          {
            heading: "1. The 5 Draw Scenarios",
            bullets: [
              "1. Stalemate: No legal moves and not in check.",
              "2. Threefold Repetition: The exact same board position occurs 3 times with the same player to move and same legal moves.",
              "3. 50-Move Rule: 50 consecutive turns pass without any pawn movement or piece capture by either side.",
              "4. Insufficient Material: Neither side has enough pieces to force checkmate (e.g., King vs King, King+Bishop vs King, King+Knight vs King).",
              "5. Mutual Agreement: Both players agree to a draw during the match.",
            ],
          },
        ],
        keyTakeaway: "Knowing draw rules helps you save lost games through perpetual check or stalemate traps.",
      },
    ],
  },
  {
    id: "05",
    num: "05",
    title: "Opening Principles",
    description: "The fundamental rules of the opening: center control, piece development, king safety, and avoiding early blunders.",
    subtopics: [
      {
        id: "control-the-center",
        title: "Control the Center",
        readTime: "2 min",
        summary: "Why controlling the d4, d5, e4, e5 squares determines opening success.",
        sections: [
          {
            heading: "1. Why the Center Matters",
            bullets: [
              "Occupying and controlling central squares (e4, d4, e5, d5) grants your pieces maximum scope and lateral agility.",
              "First Moves: Start with central pawn pushes like 1.e4 or 1.d4 to stake immediate claims in the center.",
            ],
          },
        ],
        keyTakeaway: "Control the center with pawns and support it with minor pieces.",
      },
      {
        id: "develop-pieces",
        title: "Develop Pieces",
        readTime: "2 min",
        summary: "Knights before Bishops, avoiding moving the same piece twice, and coordinated activation.",
        sections: [
          {
            heading: "1. Golden Rules of Development",
            bullets: [
              "Develop Knights before Bishops: Knights usually have clear central squares (f3, c3), while Bishops require flexible diagonal choices.",
              "Don't move the same piece multiple times in the opening unless forced by a tactical threat.",
              "Connect your Rooks by clearing all minor pieces off the back rank.",
            ],
          },
        ],
        keyTakeaway: "Bring every piece into the game rapidly; an army fighting with half its soldiers is bound to lose.",
      },
      {
        id: "king-safety",
        title: "King Safety",
        readTime: "2 min",
        summary: "Safeguarding the King before initiating central attacks.",
        sections: [
          {
            heading: "1. Early Castling",
            bullets: [
              "Castle within the first 7-10 moves before the central files open up.",
              "Do not advance the 3 pawns in front of your castled King (f, g, h pawns) unnecessarily, as this creates gaping weaknesses.",
            ],
          },
        ],
        keyTakeaway: "King safety takes precedence over greedy pawn hunting in the opening.",
      },
      {
        id: "opening-mistakes",
        title: "Common Opening Mistakes",
        readTime: "3 min",
        summary: "The most frequent beginner blunders in the first phase of the game.",
        sections: [
          {
            heading: "1. Classic Opening Traps & Mistakes",
            bullets: [
              "Bringing the Queen out on Move 2 (e.g. 2.Qh5) — easily chased away by developing knights while losing tempo.",
              "Pushing too many flank pawns (a, h pawns) instead of developing central minor pieces.",
              "Leaving the King stranded in the center of an open board.",
            ],
          },
        ],
        keyTakeaway: "Avoid premature queen raids and stick to sound development and castling.",
      },
    ],
  },
  {
    id: "06",
    num: "06",
    title: "Essential Openings",
    description: "The most important classical opening systems for White and Black.",
    subtopics: [
      {
        id: "italian-game",
        title: "Italian Game",
        readTime: "3 min",
        summary: "1.e4 e5 2.Nf3 Nc6 3.Bc4 — Classical development targeting the vulnerable f7 square.",
        sections: [
          {
            heading: "1. The Italian Structure",
            bullets: [
              "Moves: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 (Giuoco Piano) or 3...Nf6 (Two Knights Defense).",
              "Key Idea: Bishop on c4 targets Black's weakest square (f7, defended only by the King).",
              "Plan: Castle kingside, prepare c3 and d4 to build a massive classical pawn center.",
            ],
          },
        ],
        keyTakeaway: "The Italian Game is the foundational opening of classical chess, emphasizing rapid development and f7 pressure.",
      },
      {
        id: "ruy-lopez",
        title: "Ruy Lopez",
        readTime: "3 min",
        summary: "1.e4 e5 2.Nf3 Nc6 3.Bb5 — The Spanish Game applying long-term pressure on Black's center defender.",
        sections: [
          {
            heading: "1. The Spanish Setup",
            bullets: [
              "Moves: 1.e4 e5 2.Nf3 Nc6 3.Bb5.",
              "Key Idea: White pins or threatens the c6 Knight which defends Black's central e5 pawn.",
              "Black's classic replies: 3...a6 (Morphy Defense), 3...Nf6 (Berlin Defense).",
            ],
          },
        ],
        keyTakeaway: "The Ruy Lopez is renowned for rich strategic and positional battles tested by world champions for centuries.",
      },
      {
        id: "sicilian-defense",
        title: "Sicilian Defense",
        readTime: "3 min",
        summary: "1.e4 c5 — The most popular and aggressive response to 1.e4.",
        sections: [
          {
            heading: "1. Asymmetrical Warfare",
            bullets: [
              "Moves: 1.e4 c5.",
              "Key Idea: Black fights for the center from the flank (c-file), creating an asymmetrical battle with high winning chances for both sides.",
              "Popular Variations: Open Sicilian (Nadjorf, Dragon, Classical), Closed Sicilian.",
            ],
          },
        ],
        keyTakeaway: "The Sicilian Defense trades White's central d-pawn for Black's c-pawn, granting Black a central pawn majority and counterattacking chances.",
      },
      {
        id: "french-defense",
        title: "French Defense",
        readTime: "3 min",
        summary: "1.e4 e6 2.d4 d5 — Solid pawn chain structure counterattacking White's d4 center.",
        sections: [
          {
            heading: "1. The French Structure",
            bullets: [
              "Moves: 1.e4 e6 2.d4 d5.",
              "Key Idea: Black builds a rock-solid pawn chain (e6-d5) and prepares to strike at White's d4 foundation with ...c5.",
              "Trade-off: Black's light-squared Bishop on c8 is often locked inside the pawn chain ('the French Bishop').",
            ],
          },
        ],
        keyTakeaway: "The French Defense offers a resilient, counter-punching game based on pawn chains and flank pressure.",
      },
      {
        id: "queens-gambit",
        title: "Queen's Gambit",
        readTime: "3 min",
        summary: "1.d4 d5 2.c4 — Offering a flank pawn to dominate the entire board center.",
        sections: [
          {
            heading: "1. The Gambit Idea",
            bullets: [
              "Moves: 1.d4 d5 2.c4.",
              "Key Idea: White offers the c4 pawn. If Black accepts (2...dxc4 - Accepted), White plays e4 to occupy the full center.",
              "If Black declines (2...e6 - Declined, or 2...c6 - Slav), White maintains relentless spatial pressure.",
            ],
          },
        ],
        keyTakeaway: "The Queen's Gambit is not a true gambit because White can easily regain the pawn while maintaining central dominance.",
      },
    ],
  },
  {
    id: "07",
    num: "07",
    title: "Chess Tactics",
    description: "The tactical toolkit of champions: Forks, Pins, Skewers, Discovered Attacks, and Back Rank weaknesses.",
    subtopics: [
      {
        id: "fork",
        title: "Fork",
        readTime: "2 min",
        summary: "A single piece attacking two or more enemy targets simultaneously.",
        sections: [
          {
            heading: "1. The Fork Mechanism",
            bullets: [
              "A Fork occurs when one piece attacks multiple enemy pieces at the same time.",
              "Knights and Pawns are the most notorious forkers because they can attack high-value pieces (King & Queen) without being captured in return.",
            ],
          },
        ],
        keyTakeaway: "Look for undefended enemy pieces located on the same color complex or knight-distance apart.",
      },
      {
        id: "pin",
        title: "Pin",
        readTime: "2 min",
        summary: "Immobilizing an enemy piece because moving it would expose a higher-value piece behind it.",
        sections: [
          {
            heading: "1. Absolute vs Relative Pins",
            bullets: [
              "Absolute Pin: The piece behind the pinned unit is the King. Moving the pinned piece is illegal under the rules.",
              "Relative Pin: The piece behind is a Queen or Rook. Moving the pinned piece is legal but results in catastrophic material loss.",
              "Pieces that can pin: Bishops, Rooks, and Queens.",
            ],
          },
        ],
        keyTakeaway: "Pin it and win it! Apply pressure to pinned pieces with pawns.",
      },
      {
        id: "skewer",
        title: "Skewer",
        readTime: "2 min",
        summary: "The reverse pin: attacking a valuable piece in front, forcing it to move and exposing the piece behind.",
        sections: [
          {
            heading: "1. The Skewer Pattern",
            bullets: [
              "A high-value piece (e.g. King or Queen) is in front on a line. When it steps away to escape attack, the lower-value piece behind it is captured.",
              "Often called an 'x-ray attack' along ranks, files, or diagonals.",
            ],
          },
        ],
        keyTakeaway: "Look for enemy Kings and Queens lined up on the same rank, file, or diagonal with unprotected pieces.",
      },
      {
        id: "discovered-attack",
        title: "Discovered Attack",
        readTime: "2 min",
        summary: "Moving one piece out of the way to unleash a devastating hidden attack from behind.",
        sections: [
          {
            heading: "1. The Hidden Battery",
            bullets: [
              "Occurs when one piece moves, unleashing an attack from a friendly Rook, Bishop, or Queen standing directly behind it.",
              "Discovered Check: When the revealed attack checks the enemy King, the moving piece can capture anything with total impunity.",
            ],
          },
        ],
        keyTakeaway: "Discovered attacks are among the most lethal weapons in chess because the moving piece gets a free turn while the enemy deals with the discovery.",
      },
      {
        id: "double-attack",
        title: "Double Attack",
        readTime: "2 min",
        summary: "Creating two simultaneous threats that cannot both be defended in one move.",
        sections: [
          {
            heading: "1. Creating Double Threats",
            bullets: [
              "A move that attacks a piece while simultaneously threatening checkmate or a second capture.",
              "Opponent can only answer one threat, leaving the other to be executed.",
            ],
          },
        ],
        keyTakeaway: "Combine mate threats with material attacks to overwhelm your opponent's defense.",
      },
      {
        id: "back-rank",
        title: "Back Rank",
        readTime: "2 min",
        summary: "Checkmating a King trapped behind its own defensive pawn wall.",
        sections: [
          {
            heading: "1. The Back Rank Weakness",
            bullets: [
              "When a castled King has no escape squares because pawns on f7/g7/h7 block its forward movement.",
              "A Rook or Queen sliding to the 8th rank delivers an instant Back Rank Checkmate.",
              "Remedy: Create 'Luft' (air/breathing room) by pushing h3 or g3.",
            ],
          },
        ],
        keyTakeaway: "Always watch your back rank and create an escape square (luft) for your castled King.",
      },
    ],
  },
  {
    id: "08",
    num: "08",
    title: "Strategic Thinking",
    description: "Positional mastery: Pawn structures, piece activity, open files, weak squares, and space advantages.",
    subtopics: [
      {
        id: "pawn-structure",
        title: "Pawn Structure",
        readTime: "3 min",
        summary: "Isolated, doubled, backward, and passed pawns and their strategic implications.",
        sections: [
          {
            heading: "1. Pawn Formations",
            bullets: [
              "Passed Pawn: A pawn with no opposing pawns on its file or adjacent files to stop its march. A passed pawn is a criminal that must be locked up!",
              "Doubled Pawns: Two pawns of the same color on the same file, usually clumsy and hard to defend.",
              "Isolated Pawn: A pawn with no friendly pawns on adjacent files to support it.",
            ],
          },
        ],
        keyTakeaway: "Pawns define the landscape of the board. Structure determines where pieces belong.",
      },
      {
        id: "piece-activity",
        title: "Piece Activity",
        readTime: "2 min",
        summary: "Maximizing the scope, mobility, and coordination of your forces.",
        sections: [
          {
            heading: "1. Active vs Passive Pieces",
            bullets: [
              "An active piece controls critical squares and restricts the opponent.",
              "A passive piece is stuck defending weaknesses on the back ranks.",
            ],
          },
        ],
        keyTakeaway: "In equal material positions, the player with greater piece activity and coordination wins.",
      },
      {
        id: "open-files",
        title: "Open Files",
        readTime: "2 min",
        summary: "Claiming vertical avenues for heavy artillery with Rooks and Queens.",
        sections: [
          {
            heading: "1. Dominating Files",
            bullets: [
              "Open File: A file with zero pawns on it.",
              "Semi-Open File: A file with only enemy pawns on it.",
              "Double Rooks on an open file create an unstoppable battery to invade the enemy position.",
            ],
          },
        ],
        keyTakeaway: "Rooks belong on open files. Place them where pawns have been cleared.",
      },
      {
        id: "weak-squares",
        title: "Weak Squares",
        readTime: "2 min",
        summary: "Holes in the enemy camp that cannot be defended by enemy pawns.",
        sections: [
          {
            heading: "1. Outposts & Holes",
            bullets: [
              "A weak square (hole) is a square that can never again be protected by a pawn.",
              "Planting a Knight on an enemy weak square turns it into an unshakeable monster outpost.",
            ],
          },
        ],
        keyTakeaway: "Identify holes created by enemy pawn pushes and occupy them with minor pieces.",
      },
      {
        id: "space-advantage",
        title: "Space Advantage",
        readTime: "2 min",
        summary: "Controlling more board territory to grant your pieces freedom while cramping the opponent.",
        sections: [
          {
            heading: "1. Utilizing Space",
            bullets: [
              "The player with more space can easily shift pieces between kingside and queenside.",
              "When cramped with less space, trade pieces to relieve the congestion in your camp.",
            ],
          },
        ],
        keyTakeaway: "When you have a space advantage, avoid unnecessary piece trades and build pressure.",
      },
    ],
  },
  {
    id: "09",
    num: "09",
    title: "Middlegame",
    description: "The heart of chess battle: Formulating plans, calculating exchanges, king attacks, and positional maneuvers.",
    subtopics: [
      {
        id: "planning",
        title: "Planning",
        readTime: "3 min",
        summary: "How to evaluate a position and formulate a concrete multi-move plan.",
        sections: [
          {
            heading: "1. Steps in Formulating a Plan",
            bullets: [
              "1. Evaluate King safety for both sides.",
              "2. Assess material balance.",
              "3. Identify weaknesses in the enemy pawn structure and piece placement.",
              "4. Create a target and coordinate 2 or more pieces to attack it.",
            ],
          },
        ],
        keyTakeaway: "A bad plan is better than no plan at all. Always play with a clear purpose.",
      },
      {
        id: "exchanges",
        title: "Exchanges",
        readTime: "2 min",
        summary: "When to trade pieces and when to keep tension on the board.",
        sections: [
          {
            heading: "1. Trading Principles",
            bullets: [
              "Trade pieces when you are ahead in material to simplify into an easily winning endgame.",
              "Trade off the opponent's best active attacker with your passive piece.",
              "Avoid trades when you have an ongoing checkmating attack.",
            ],
          },
        ],
        keyTakeaway: "Every exchange alters the position permanently. Only trade when it benefits your plan.",
      },
      {
        id: "attacking-the-king",
        title: "Attacking the King",
        readTime: "3 min",
        summary: "Prying open defensive pawn shields and conducting decisive mating attacks.",
        sections: [
          {
            heading: "1. The Art of the Attack",
            bullets: [
              "Open lines toward the enemy King using pawn breaks or sacrifices.",
              "Bring overwhelming piece superiority to the attacking sector (e.g., 4 attackers vs 2 defenders).",
            ],
          },
        ],
        keyTakeaway: "Do not rush a king attack without proper piece superiority and open lines of entry.",
      },
      {
        id: "positional-play",
        title: "Positional Play",
        readTime: "2 min",
        summary: "Quiet prophylactic maneuvers that restrict the enemy and improve your worst piece.",
        sections: [
          {
            heading: "1. Improving Your Worst Piece",
            bullets: [
              "Find your least active piece and reroute it to a stronger square.",
              "Prophylaxis: Anticipate and neutralize the opponent's threats before they execute them.",
            ],
          },
        ],
        keyTakeaway: "Positional chess prepares the ground so that tactical victories become inevitable.",
      },
    ],
  },
  {
    id: "10",
    num: "10",
    title: "Endgame Fundamentals",
    description: "The technical phase where pawns queen and precise King activity decides the victor.",
    subtopics: [
      {
        id: "king-and-pawn",
        title: "King & Pawn",
        readTime: "3 min",
        summary: "The Rule of the Square, Key Squares, Opposition, and triangulation.",
        sections: [
          {
            heading: "1. The Rule of the Square",
            bullets: [
              "Draw a mental square from the pawn to the promotion rank. If the defending King can step inside the square, it can catch the pawn; if not, the pawn queens.",
            ],
          },
          {
            heading: "2. The Opposition",
            bullets: [
              "Direct Opposition: Two Kings facing each other with 1 square between them on a file or rank. The player who does NOT have to move holds the opposition.",
            ],
          },
        ],
        keyTakeaway: "King activity and opposition are the lifeblood of King and Pawn endings.",
      },
      {
        id: "queen-endgames",
        title: "Queen Endgames",
        readTime: "2 min",
        summary: "Navigating perpetual check risks and escorting passed pawns to victory.",
        sections: [
          {
            heading: "1. Queen Endgame Traits",
            bullets: [
              "Perpetual check is the most common defensive drawing resource.",
              "Centralize your Queen to maximize both defensive coverage and attacking checks.",
            ],
          },
        ],
        keyTakeaway: "In Queen endgames, King safety remains paramount to avoid endless perpetual checks.",
      },
      {
        id: "rook-endgames",
        title: "Rook Endgames",
        readTime: "3 min",
        summary: "Lucena Position (Building a Bridge) and Philidor Defense (3rd rank defense).",
        sections: [
          {
            heading: "1. Essential Positions",
            bullets: [
              "Lucena Position: The winning technique using the Rook to build a 'bridge' on the 4th rank to shield the King from checks.",
              "Philidor Defense: The drawing technique using the Rook on the 6th rank to keep the enemy King at bay, then checking from behind.",
            ],
          },
        ],
        keyTakeaway: "Rook endgames are the most common in chess. Master the Lucena and Philidor techniques.",
      },
      {
        id: "bishop-endgames",
        title: "Bishop Endgames",
        readTime: "2 min",
        summary: "Same-colored bishops vs opposite-colored bishops.",
        sections: [
          {
            heading: "1. Opposite Colored Bishops",
            bullets: [
              "Opposite-colored bishop endgames have immense drawing tendencies even when down 1 or 2 pawns.",
              "Same-colored bishop endgames favor the side with pawns on the opposite color of their Bishop.",
            ],
          },
        ],
        keyTakeaway: "Opposite-colored bishops are drawish in endgames, but highly attacking in middlegames.",
      },
      {
        id: "knight-endgames",
        title: "Knight Endgames",
        readTime: "2 min",
        summary: "Knight endgames closely resemble King & Pawn endings due to their short range.",
        sections: [
          {
            heading: "1. Knight Endgame Traits",
            bullets: [
              "Knights are slow across the board and struggle against outside passed pawns on opposite flanks.",
            ],
          },
        ],
        keyTakeaway: "Create outside passed pawns to overload and outdistance the enemy Knight.",
      },
    ],
  },
  {
    id: "11",
    num: "11",
    title: "Calculation & Visualization",
    description: "Developing a Grandmaster mind: Candidate moves, deep variations, and board visualization.",
    subtopics: [
      {
        id: "candidate-moves",
        title: "Candidate Moves",
        readTime: "2 min",
        summary: "Identifying all plausible first moves before calculating deep branches.",
        sections: [
          {
            heading: "1. The Kotov Method",
            bullets: [
              "List 2 to 4 candidate moves first (Checks, Captures, Threats).",
              "Calculate each candidate move tree systematically without jumping back and forth.",
            ],
          },
        ],
        keyTakeaway: "Never jump straight into calculating the first move you see. Broaden your candidate list.",
      },
      {
        id: "variations",
        title: "Variations",
        readTime: "2 min",
        summary: "Calculating forcing lines to their logical conclusion.",
        sections: [
          {
            heading: "1. Forcing Moves First",
            bullets: [
              "Prioritize forcing moves: Checks first, Captures second, Threats third (C-C-T).",
            ],
          },
        ],
        keyTakeaway: "Forcing moves narrow the opponent's responses and make calculation precise.",
      },
      {
        id: "tactical-calculation",
        title: "Tactical Calculation",
        readTime: "2 min",
        summary: "Spotting tactical motifs and calculating combinations under time pressure.",
        sections: [
          {
            heading: "1. Pattern Spotting",
            bullets: [
              "Look for loose (undefended) pieces, aligned kings and queens, and overloaded defenders.",
            ],
          },
        ],
        keyTakeaway: "Tactics flow from a superior position. Calculate with ruthless precision.",
      },
      {
        id: "board-visualization",
        title: "Board Visualization",
        readTime: "2 min",
        summary: "Seeing moves ahead clearly in your mind's eye without touching the pieces.",
        sections: [
          {
            heading: "1. Mental Training",
            bullets: [
              "Practice blindfold exercises and reciting square colors (e.g. 'c4 is light, e4 is dark').",
            ],
          },
        ],
        keyTakeaway: "Strong visualization prevents 'board blindness' and tactical blindspots.",
      },
    ],
  },
  {
    id: "12",
    num: "12",
    title: "Practical Chess",
    description: "Over-the-board psychological skills: Clock management, blunder checks, and systematic game reviews.",
    subtopics: [
      {
        id: "time-management",
        title: "Time Management",
        readTime: "2 min",
        summary: "Allocating clock time efficiently across critical and non-critical positions.",
        sections: [
          {
            heading: "1. Clock Strategy",
            bullets: [
              "Play routine opening moves quickly; reserve time for critical middlegame inflection points.",
            ],
          },
        ],
        keyTakeaway: "Time is a piece! Don't let clock pressure force hasty blunders.",
      },
      {
        id: "blunder-prevention",
        title: "Blunder Prevention",
        readTime: "2 min",
        summary: "The 5-second blunder check before every move you make.",
        sections: [
          {
            heading: "1. The 5-Second Check",
            bullets: [
              "Before releasing a piece, ask: 'What does my opponent want to do? Does this move leave anything undefended?'",
            ],
          },
        ],
        keyTakeaway: "One blunder can erase 40 brilliant moves. Always run a final safety check.",
      },
      {
        id: "game-analysis",
        title: "Game Analysis",
        readTime: "2 min",
        summary: "Analyzing your losses without engine crutches first.",
        sections: [
          {
            heading: "1. The Review Process",
            bullets: [
              "Review the game first with your own brain, finding where your plan went wrong before turning on the engine.",
            ],
          },
        ],
        keyTakeaway: "You learn more from one analyzed loss than from ten casual wins.",
      },
      {
        id: "post-game-review",
        title: "Post-Game Review",
        readTime: "2 min",
        summary: "Categorizing mistakes into opening knowledge, tactical misses, and endgame technique.",
        sections: [
          {
            heading: "1. Categorizing Errors",
            bullets: [
              "Classify every mistake: Was it an opening memorization issue, a tactical miss, or poor time management?",
            ],
          },
        ],
        keyTakeaway: "Track your recurring mistakes to know exactly what to study next.",
      },
    ],
  },
  {
    id: "13",
    num: "13",
    title: "Advanced Chess",
    description: "Master-level concepts: Positional sacrifices, opening preparation, and deep endgame technique.",
    subtopics: [
      {
        id: "advanced-tactics",
        title: "Advanced Tactics",
        readTime: "2 min",
        summary: "Interference, deflection, clearance, and quiet preparatory moves.",
        sections: [
          {
            heading: "1. Complex Motifs",
            bullets: [
              "Deflection: Luring a defending piece away from its critical protection duty.",
              "Clearance: Vacating a square or line with tempo to allow another piece to strike.",
            ],
          },
        ],
        keyTakeaway: "Advanced tactics involve sacrificing material to disrupt coordination.",
      },
      {
        id: "advanced-strategy",
        title: "Advanced Strategy",
        readTime: "2 min",
        summary: "Color complex domination, the principle of two weaknesses, and blockades.",
        sections: [
          {
            heading: "1. Principle of Two Weaknesses",
            bullets: [
              "Create a second weakness on the opposite side of the board to stretch enemy defenses until they collapse.",
            ],
          },
        ],
        keyTakeaway: "One weakness can be defended; two weaknesses separated across the board cannot.",
      },
      {
        id: "opening-prep",
        title: "Opening Preparation",
        readTime: "2 min",
        summary: "Constructing and maintaining a personalized opening repertoire.",
        sections: [
          {
            heading: "1. Repertoire Building",
            bullets: [
              "Pick 1 main weapon as White (e.g. 1.e4 or 1.d4) and 2 reliable responses as Black (against 1.e4 and 1.d4).",
            ],
          },
        ],
        keyTakeaway: "Understand the plans and pawn structures of your openings rather than memorizing raw moves.",
      },
      {
        id: "positional-sacrifices",
        title: "Positional Sacrifices",
        readTime: "2 min",
        summary: "Giving up material not for immediate mate, but for lasting positional domination.",
        sections: [
          {
            heading: "1. The Exchange Sacrifice",
            bullets: [
              "Sacrificing a Rook for a minor piece to shatter enemy pawn structure or seize an immortal knight outpost.",
            ],
          },
        ],
        keyTakeaway: "Material is transient; positional domination is permanent.",
      },
      {
        id: "advanced-endgames",
        title: "Advanced Endgames",
        readTime: "2 min",
        summary: "Fortresses, pawn races, and complex multi-piece endings.",
        sections: [
          {
            heading: "1. Fortress Techniques",
            bullets: [
              "Setting up an impregnable barrier where the opponent cannot make progress despite material superiority.",
            ],
          },
        ],
        keyTakeaway: "Study endgames to understand the true value of every piece on the board.",
      },
    ],
  },
  {
    id: "14",
    num: "14",
    title: "Chess Improvement",
    description: "The structured daily training regimen to reach master strength.",
    subtopics: [
      {
        id: "solve-puzzles",
        title: "Solve Puzzles",
        readTime: "2 min",
        summary: "Daily tactical training and pattern recognition workouts.",
        sections: [
          {
            heading: "1. Tactical Discipline",
            bullets: [
              "Solve 15-20 tactical puzzles every day to build lightning-fast subconscious pattern recognition.",
            ],
          },
        ],
        keyTakeaway: "Tactics are 90% of chess below master level. Train daily.",
      },
      {
        id: "analyze-games",
        title: "Analyze Games",
        readTime: "2 min",
        summary: "The disciplined habit of annotating every serious game you play.",
        sections: [
          {
            heading: "1. Self-Annotation",
            bullets: [
              "Write down your thoughts during the game and find the critical turning point.",
            ],
          },
        ],
        keyTakeaway: "Analyzing your own games is the single fastest path to chess improvement.",
      },
      {
        id: "grandmaster-games",
        title: "Study Grandmaster Games",
        readTime: "2 min",
        summary: "Learning classical play from Capablanca, Fischer, Kasparov, and Carlsen.",
        sections: [
          {
            heading: "1. Classical Heritage",
            bullets: [
              "Play through annotated master games to understand how world champions coordinate their forces.",
            ],
          },
        ],
        keyTakeaway: "Absorb master intuition by studying classical game collections.",
      },
      {
        id: "opening-repertoire",
        title: "Build an Opening Repertoire",
        readTime: "2 min",
        summary: "Deepening your mastery over your chosen systems.",
        sections: [
          {
            heading: "1. Repertoire Depth",
            bullets: [
              "Expand your opening tree after each game whenever an opponent plays a novel move.",
            ],
          },
        ],
        keyTakeaway: "A well-crafted repertoire gives you confidence and a time advantage on the clock.",
      },
      {
        id: "training-plan",
        title: "Create a Training Plan",
        readTime: "2 min",
        summary: "Structuring your weekly chess training: 50% Tactics, 25% Playing & Review, 25% Endgames & Strategy.",
        sections: [
          {
            heading: "1. The 50/25/25 Rule",
            bullets: [
              "Allocate 50% of your study time to tactics and puzzles.",
              "Allocate 25% to playing serious games and analyzing them thoroughly.",
              "Allocate 25% to endgames, strategy, and master game reviews.",
            ],
          },
        ],
        keyTakeaway: "Consistency beats intensity. 30 minutes of focused daily training outclasses 5 hours on weekends.",
      },
    ],
  },
];
