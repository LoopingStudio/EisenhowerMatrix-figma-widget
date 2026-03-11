const { widget } = figma;
const {
  AutoLayout,
  Text,
  Input,
  SVG,
  Frame,
  Ellipse,
  useSyncedState,
  useSyncedMap,
  usePropertyMenu,
  useWidgetId,
} = widget;

// ─── Types ───────────────────────────────────────────────────────────────────

interface VotePosition {
  col: number;
  row: number;
  userName: string;
  userPhoto: string | null;
  imageHash: string | null;
}

// ─── i18n ────────────────────────────────────────────────────────────────────

type Lang = "fr" | "en" | "es" | "de" | "ja" | "pt";

const TRANSLATIONS = {
  fr: {
    title: "Matrice d'Eisenhower",
    placeholder: "Sujet à évaluer...",
    noVotes: "Aucun vote",
    vote: "vote",
    votes: "votes",
    result: "Résultat",
    revealVotes: "Révéler les votes",
    hideVotes: "Masquer les votes",
    generateImage: "Générer l'image du résultat",
    resetVotes: "Réinitialiser les votes",
    selectReveal: 'Sélectionnez le widget puis "Révéler les votes"',
    clickToVote: "Cliquez sur la matrice pour placer votre vote",
    tooltipVote: "Cliquer pour placer votre vote",
    notUrgent: "PAS URGENT",
    urgent: "URGENT",
    important: "IMPORTANT",
    notImportant: "PAS IMPORTANT",
    do: "FAIRE",
    schedule: "PLANIFIER",
    delegate: "DÉLÉGUER",
    eliminate: "ÉLIMINER",
    average: "Moyenne",
    anonymous: "Anonyme",
    resultFrame: "Résultat",
    lockVotes: "Verrouiller les votes",
    unlockVotes: "Déverrouiller les votes",
    votesLocked: "Votes verrouillés",
    tooltipLocked: "Les votes sont verrouillés",
  },
  en: {
    title: "Eisenhower Matrix",
    placeholder: "Topic to evaluate...",
    noVotes: "No votes",
    vote: "vote",
    votes: "votes",
    result: "Result",
    revealVotes: "Reveal votes",
    hideVotes: "Hide votes",
    generateImage: "Generate result image",
    resetVotes: "Reset votes",
    selectReveal: 'Select the widget then "Reveal votes"',
    clickToVote: "Click on the matrix to place your vote",
    tooltipVote: "Click to place your vote",
    notUrgent: "NOT URGENT",
    urgent: "URGENT",
    important: "IMPORTANT",
    notImportant: "NOT IMPORTANT",
    do: "DO",
    schedule: "SCHEDULE",
    delegate: "DELEGATE",
    eliminate: "ELIMINATE",
    average: "Average",
    anonymous: "Anonymous",
    resultFrame: "Result",
    lockVotes: "Lock votes",
    unlockVotes: "Unlock votes",
    votesLocked: "Votes locked",
    tooltipLocked: "Votes are locked",
  },
  es: {
    title: "Matriz de Eisenhower",
    placeholder: "Tema a evaluar...",
    noVotes: "Sin votos",
    vote: "voto",
    votes: "votos",
    result: "Resultado",
    revealVotes: "Revelar votos",
    hideVotes: "Ocultar votos",
    generateImage: "Generar imagen del resultado",
    resetVotes: "Reiniciar votos",
    selectReveal: 'Selecciona el widget y luego "Revelar votos"',
    clickToVote: "Haz clic en la matriz para votar",
    tooltipVote: "Haz clic para votar",
    notUrgent: "NO URGENTE",
    urgent: "URGENTE",
    important: "IMPORTANTE",
    notImportant: "NO IMPORTANTE",
    do: "HACER",
    schedule: "PROGRAMAR",
    delegate: "DELEGAR",
    eliminate: "ELIMINAR",
    average: "Promedio",
    anonymous: "Anónimo",
    resultFrame: "Resultado",
    lockVotes: "Bloquear votos",
    unlockVotes: "Desbloquear votos",
    votesLocked: "Votos bloqueados",
    tooltipLocked: "Los votos están bloqueados",
  },
  de: {
    title: "Eisenhower-Matrix",
    placeholder: "Thema bewerten...",
    noVotes: "Keine Stimmen",
    vote: "Stimme",
    votes: "Stimmen",
    result: "Ergebnis",
    revealVotes: "Stimmen anzeigen",
    hideVotes: "Stimmen verbergen",
    generateImage: "Ergebnisbild erstellen",
    resetVotes: "Stimmen zurücksetzen",
    selectReveal: 'Widget auswählen, dann "Stimmen anzeigen"',
    clickToVote: "Klicken Sie auf die Matrix, um abzustimmen",
    tooltipVote: "Klicken zum Abstimmen",
    notUrgent: "NICHT DRINGEND",
    urgent: "DRINGEND",
    important: "WICHTIG",
    notImportant: "NICHT WICHTIG",
    do: "ERLEDIGEN",
    schedule: "TERMINIEREN",
    delegate: "DELEGIEREN",
    eliminate: "ELIMINIEREN",
    average: "Durchschnitt",
    anonymous: "Anonym",
    resultFrame: "Ergebnis",
    lockVotes: "Abstimmung sperren",
    unlockVotes: "Abstimmung freigeben",
    votesLocked: "Abstimmung gesperrt",
    tooltipLocked: "Abstimmung ist gesperrt",
  },
  ja: {
    title: "アイゼンハワー・マトリクス",
    placeholder: "評価するトピック...",
    noVotes: "投票なし",
    vote: "票",
    votes: "票",
    result: "結果",
    revealVotes: "投票を表示",
    hideVotes: "投票を非表示",
    generateImage: "結果画像を生成",
    resetVotes: "投票をリセット",
    selectReveal: 'ウィジェットを選択して「投票を表示」',
    clickToVote: "マトリクスをクリックして投票",
    tooltipVote: "クリックして投票",
    notUrgent: "緊急でない",
    urgent: "緊急",
    important: "重要",
    notImportant: "重要でない",
    do: "すぐやる",
    schedule: "計画する",
    delegate: "人に任せる",
    eliminate: "やらない",
    average: "平均",
    anonymous: "匿名",
    resultFrame: "結果",
    lockVotes: "投票をロック",
    unlockVotes: "投票をアンロック",
    votesLocked: "投票はロックされています",
    tooltipLocked: "投票はロックされています",
  },
  pt: {
    title: "Matriz de Eisenhower",
    placeholder: "Tópico a avaliar...",
    noVotes: "Sem votos",
    vote: "voto",
    votes: "votos",
    result: "Resultado",
    revealVotes: "Revelar votos",
    hideVotes: "Ocultar votos",
    generateImage: "Gerar imagem do resultado",
    resetVotes: "Redefinir votos",
    selectReveal: 'Selecione o widget e depois "Revelar votos"',
    clickToVote: "Clique na matriz para votar",
    tooltipVote: "Clique para votar",
    notUrgent: "NÃO URGENTE",
    urgent: "URGENTE",
    important: "IMPORTANTE",
    notImportant: "NÃO IMPORTANTE",
    do: "FAZER",
    schedule: "AGENDAR",
    delegate: "DELEGAR",
    eliminate: "ELIMINAR",
    average: "Média",
    anonymous: "Anónimo",
    resultFrame: "Resultado",
    lockVotes: "Bloquear votos",
    unlockVotes: "Desbloquear votos",
    votesLocked: "Votos bloqueados",
    tooltipLocked: "Os votos estão bloqueados",
  },
} as const;

type TranslationKey = keyof typeof TRANSLATIONS.en;

const LANG_OPTIONS: Array<{ option: Lang; label: string }> = [
  { option: "fr", label: "Français" },
  { option: "en", label: "English" },
  { option: "es", label: "Español" },
  { option: "de", label: "Deutsch" },
  { option: "ja", label: "日本語" },
  { option: "pt", label: "Português" },
];

function t(lang: Lang, key: TranslationKey): string {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}

// ─── Icons (SVG for property menu) ───────────────────────────────────────────

const ICON_EYE = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4.5C6 4.5 2.7 7 1 10c1.7 3 5 5.5 9 5.5s7.3-2.5 9-5.5c-1.7-3-5-5.5-9-5.5Z" stroke="white" stroke-width="1.5" fill="none"/><circle cx="10" cy="10" r="2.5" stroke="white" stroke-width="1.5" fill="none"/></svg>`;

const ICON_EYE_OFF = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4.5C6 4.5 2.7 7 1 10c1.7 3 5 5.5 9 5.5s7.3-2.5 9-5.5c-1.7-3-5-5.5-9-5.5Z" stroke="white" stroke-width="1.5" fill="none"/><circle cx="10" cy="10" r="2.5" stroke="white" stroke-width="1.5" fill="none"/><line x1="3" y1="17" x2="17" y2="3" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`;

const ICON_IMAGE = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="16" height="16" rx="2" stroke="white" stroke-width="1.5" fill="none"/><path d="M2 14l4-4 3 3 4-5 5 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="7" cy="7" r="1.5" fill="white"/></svg>`;

const ICON_RESET = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8l-2-2 2-2" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 6h12a4 4 0 0 1 0 8H6" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`;

const ICON_LOCK = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="9" width="12" height="9" rx="2" stroke="white" stroke-width="1.5" fill="none"/><path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="10" cy="13.5" r="1.5" fill="white"/></svg>`;

const ICON_UNLOCK = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="9" width="12" height="9" rx="2" stroke="white" stroke-width="1.5" fill="none"/><path d="M7 9V6a3 3 0 0 1 6 0" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="10" cy="13.5" r="1.5" fill="white"/></svg>`;

// ─── Constants ───────────────────────────────────────────────────────────────

const GRID_COLS = 12;
const GRID_ROWS = 12;
const CELL_SIZE = 40;
const GRID_WIDTH = GRID_COLS * CELL_SIZE;
const GRID_HEIGHT = GRID_ROWS * CELL_SIZE;
const AXIS_LABEL_SIZE = 28;
const TOTAL_WIDTH = GRID_WIDTH + AXIS_LABEL_SIZE * 2;

const Q_COLORS = {
  topLeft: { r: 0.86, g: 0.92, b: 0.99 },
  topRight: { r: 0.99, g: 0.89, b: 0.88 },
  bottomLeft: { r: 0.82, g: 0.98, b: 0.90 },
  bottomRight: { r: 1.0, g: 0.95, b: 0.78 },
};

const DOT_COLORS = [
  "#EF4444", "#3B82F6", "#F59E0B", "#10B981",
  "#8B5CF6", "#EC4899", "#F97316", "#06B6D4",
  "#84CC16", "#6366F1", "#E11D48", "#14B8A6",
];

const DOT_COLORS_RGB = DOT_COLORS.map(hexToRgb);

// Pre-computed cell colors (grid is static)
const CELL_COLORS: string[][] = [];
for (let row = 0; row < GRID_ROWS; row++) {
  CELL_COLORS[row] = [];
  for (let col = 0; col < GRID_COLS; col++) {
    CELL_COLORS[row][col] = bilinearHex(col, row);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bilinearInterp(col: number, row: number): RGB {
  const tx = col / (GRID_COLS - 1);
  const ty = row / (GRID_ROWS - 1);
  const tl = Q_COLORS.topLeft;
  const tr = Q_COLORS.topRight;
  const bl = Q_COLORS.bottomLeft;
  const br = Q_COLORS.bottomRight;
  return {
    r: tl.r * (1 - tx) * (1 - ty) + tr.r * tx * (1 - ty) + bl.r * (1 - tx) * ty + br.r * tx * ty,
    g: tl.g * (1 - tx) * (1 - ty) + tr.g * tx * (1 - ty) + bl.g * (1 - tx) * ty + br.g * tx * ty,
    b: tl.b * (1 - tx) * (1 - ty) + tr.b * tx * (1 - ty) + bl.b * (1 - tx) * ty + br.b * tx * ty,
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function bilinearHex(col: number, row: number): string {
  return rgbToHex(bilinearInterp(col, row));
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function getDotColor(index: number): string {
  return DOT_COLORS[index % DOT_COLORS.length];
}

function getDotColorRgb(index: number): RGB {
  return DOT_COLORS_RGB[index % DOT_COLORS_RGB.length];
}

function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

function getQuadrantKey(avgCol: number, avgRow: number): TranslationKey {
  const isUrgent = avgCol >= GRID_COLS / 2;
  const isImportant = avgRow < GRID_ROWS / 2;
  if (isUrgent && isImportant) return "do";
  if (!isUrgent && isImportant) return "schedule";
  if (isUrgent && !isImportant) return "delegate";
  return "eliminate";
}

function computeVoteAverages(votes: Array<[string, VotePosition]>): { avgCol: number; avgRow: number } {
  let sumCol = 0;
  let sumRow = 0;
  for (const [, vote] of votes) {
    sumCol += vote.col;
    sumRow += vote.row;
  }
  const count = votes.length;
  return { avgCol: sumCol / count, avgRow: sumRow / count };
}

function formatVoteCount(count: number, lang: Lang): string {
  if (count === 0) return t(lang, "noVotes");
  return `${count} ${count > 1 ? t(lang, "votes") : t(lang, "vote")}`;
}

// Pre-compute vote-by-cell lookup map
type CellVote = { key: string; vote: VotePosition; index: number };
function buildVoteByCellMap(votes: Array<[string, VotePosition]>): Map<string, CellVote[]> {
  const map = new Map<string, CellVote[]>();
  let idx = 0;
  for (const [key, vote] of votes) {
    const cellKey = `${vote.col}:${vote.row}`;
    let arr = map.get(cellKey);
    if (!arr) {
      arr = [];
      map.set(cellKey, arr);
    }
    arr.push({ key, vote, index: idx });
    idx++;
  }
  return map;
}

// ─── Axis color constants ────────────────────────────────────────────────────

const AXIS_COLORS = {
  notUrgent: { hex: "#3B82F6", rgb: hexToRgb("#3B82F6") },
  urgent: { hex: "#EF4444", rgb: hexToRgb("#EF4444") },
  important: { hex: "#10B981", rgb: hexToRgb("#10B981") },
  notImportant: { hex: "#9CA3AF", rgb: hexToRgb("#9CA3AF") },
};

const DARK_COLOR: RGB = { r: 0.12, g: 0.16, b: 0.21 };

// ─── Main Widget ─────────────────────────────────────────────────────────────

function EisenhowerMatrix() {
  const widgetId = useWidgetId();
  const votesMap = useSyncedMap<VotePosition>("votes");
  const [showVotes, setShowVotes] = useSyncedState<boolean>("showVotes", false);
  const [topic, setTopic] = useSyncedState<string>("topic", "");
  const [lang, setLang] = useSyncedState<Lang>("lang", "en");
  const [locked, setLocked] = useSyncedState<boolean>("locked", false);

  const allVotes = votesMap.entries();
  const voterCount = allVotes.length;

  // Pre-compute vote lookup map (O(V) once instead of O(V*144))
  const voteByCellMap = showVotes ? buildVoteByCellMap(allVotes) : null;

  // Property menu
  usePropertyMenu(
    [
      {
        itemType: "dropdown",
        propertyName: "lang",
        tooltip: "Language",
        selectedOption: lang,
        options: LANG_OPTIONS,
      },
      {
        itemType: "separator",
      },
      {
        itemType: "toggle",
        propertyName: "showVotes",
        tooltip: showVotes ? t(lang, "hideVotes") : t(lang, "revealVotes"),
        isToggled: showVotes,
        icon: showVotes ? ICON_EYE_OFF : ICON_EYE,
      },
      {
        itemType: "toggle",
        propertyName: "locked",
        tooltip: locked ? t(lang, "unlockVotes") : t(lang, "lockVotes"),
        isToggled: locked,
        icon: locked ? ICON_LOCK : ICON_UNLOCK,
      },
      {
        itemType: "action",
        propertyName: "generateImage",
        tooltip: t(lang, "generateImage"),
        icon: ICON_IMAGE,
      },
      {
        itemType: "separator",
      },
      {
        itemType: "action",
        propertyName: "resetVotes",
        tooltip: t(lang, "resetVotes"),
        icon: ICON_RESET,
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === "lang") {
        setLang(propertyValue as Lang);
      } else if (propertyName === "showVotes") {
        setShowVotes(!showVotes);
      } else if (propertyName === "locked") {
        setLocked(!locked);
      } else if (propertyName === "generateImage") {
        return generateResultImage();
      } else if (propertyName === "resetVotes") {
        const keys = [...votesMap.keys()];
        for (const key of keys) votesMap.delete(key);
      }
    }
  );

  // Place vote handler
  async function placeVote(col: number, row: number) {
    const user = figma.currentUser;
    const sessionId = user?.sessionId?.toString() || "anonymous";
    const photoUrl = user?.photoUrl || null;

    let imageHash: string | null = null;
    if (photoUrl) {
      try {
        const image = await figma.createImageAsync(photoUrl);
        imageHash = image.hash;
      } catch (e) {
        console.warn("Failed to load avatar:", e);
      }
    }

    votesMap.set(sessionId, {
      col,
      row,
      userName: user?.name || t(lang, "anonymous"),
      userPhoto: photoUrl,
      imageHash,
    });
  }

  // ─── Generate result image ──────────────────────────────────────────────

  async function generateResultImage() {
    const widgetNode = await figma.getNodeByIdAsync(widgetId) as WidgetNode;
    if (!widgetNode || voterCount === 0) return;

    await Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Medium" }),
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    ]);

    const IMG_SIZE = 400;
    const MARGIN = 36;
    const INNER = IMG_SIZE - MARGIN * 2;
    const gridOffsetY = 44;

    const frame = figma.createFrame();
    frame.name = topic ? `${t(lang, "resultFrame")} — ${topic}` : `${t(lang, "resultFrame")} ${t(lang, "title")}`;
    frame.resize(IMG_SIZE, IMG_SIZE + 60);
    frame.x = widgetNode.x + widgetNode.width + 80;
    frame.y = widgetNode.y;
    frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    frame.cornerRadius = 16;
    frame.clipsContent = true;

    // ── Title ──
    const titleNode = figma.createText();
    titleNode.fontName = { family: "Inter", style: "Bold" };
    titleNode.characters = topic || t(lang, "title");
    titleNode.fontSize = 14;
    titleNode.fills = [{ type: "SOLID", color: DARK_COLOR }];
    titleNode.x = MARGIN;
    titleNode.y = 16;
    frame.appendChild(titleNode);

    // ── Vote count ──
    const subtitleNode = figma.createText();
    subtitleNode.fontName = { family: "Inter", style: "Medium" };
    subtitleNode.characters = formatVoteCount(voterCount, lang);
    subtitleNode.fontSize = 10;
    subtitleNode.fills = [{ type: "SOLID", color: { r: 0.42, g: 0.45, b: 0.5 } }];
    subtitleNode.x = MARGIN;
    subtitleNode.y = 32;
    frame.appendChild(subtitleNode);

    // ── Quadrant backgrounds ──
    const quadrants = [
      { x: 0, y: 0, color: Q_COLORS.topLeft },
      { x: INNER / 2, y: 0, color: Q_COLORS.topRight },
      { x: 0, y: INNER / 2, color: Q_COLORS.bottomLeft },
      { x: INNER / 2, y: INNER / 2, color: Q_COLORS.bottomRight },
    ];

    for (const q of quadrants) {
      const rect = figma.createRectangle();
      rect.resize(INNER / 2, INNER / 2);
      rect.x = MARGIN + q.x;
      rect.y = gridOffsetY + MARGIN + q.y;
      rect.fills = [{ type: "SOLID", color: q.color }];
      frame.appendChild(rect);
    }

    // ── Cross separator ──
    const vLine = figma.createRectangle();
    vLine.resize(1, INNER);
    vLine.x = MARGIN + INNER / 2;
    vLine.y = gridOffsetY + MARGIN;
    vLine.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    vLine.opacity = 0.1;
    frame.appendChild(vLine);

    const hLine = figma.createRectangle();
    hLine.resize(INNER, 1);
    hLine.x = MARGIN;
    hLine.y = gridOffsetY + MARGIN + INNER / 2;
    hLine.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    hLine.opacity = 0.1;
    frame.appendChild(hLine);

    // ── Pre-fetch avatars in parallel ──
    const uniquePhotos = [...new Set(allVotes.filter(([, v]) => v.userPhoto).map(([, v]) => v.userPhoto!))];
    const imageMap = new Map<string, ImageHash>();
    await Promise.all(uniquePhotos.map(async (url) => {
      try {
        const image = await figma.createImageAsync(url);
        imageMap.set(url, image.hash);
      } catch (e) {
        console.warn("Failed to load avatar for export:", e);
      }
    }));

    // ── Vote dots ──
    const cellGroups = buildVoteByCellMap(allVotes);

    for (const [, group] of cellGroups) {
      const count = group.length;

      for (let i = 0; i < count; i++) {
        const { vote, index: voteIdx } = group[i];
        const vx = MARGIN + ((vote.col + 0.5) / GRID_COLS) * INNER;
        const vy = gridOffsetY + MARGIN + ((vote.row + 0.5) / GRID_ROWS) * INNER;
        const offset = count > 1 ? (i - (count - 1) / 2) * 10 : 0;
        const dotSize = 22;
        const dotColor = getDotColorRgb(voteIdx);

        // Shadow
        const shadow = figma.createEllipse();
        shadow.resize(dotSize, dotSize);
        shadow.x = vx - dotSize / 2 + offset;
        shadow.y = vy - dotSize / 2 + 2;
        shadow.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
        shadow.opacity = 0.15;
        frame.appendChild(shadow);

        // Dot
        const dot = figma.createEllipse();
        dot.resize(dotSize, dotSize);
        dot.x = vx - dotSize / 2 + offset;
        dot.y = vy - dotSize / 2;

        let hasAvatar = false;
        if (vote.userPhoto) {
          const hash = imageMap.get(vote.userPhoto);
          if (hash) {
            dot.fills = [{ type: "IMAGE", imageHash: hash, scaleMode: "FILL" }];
            hasAvatar = true;
          } else {
            dot.fills = [{ type: "SOLID", color: dotColor }];
          }
        } else {
          dot.fills = [{ type: "SOLID", color: dotColor }];
        }

        dot.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
        dot.strokeWeight = 2;
        dot.strokeAlign = "OUTSIDE";
        frame.appendChild(dot);

        if (!hasAvatar) {
          const initialsNode = figma.createText();
          initialsNode.fontName = { family: "Inter", style: "Bold" };
          initialsNode.characters = getInitials(vote.userName);
          initialsNode.fontSize = 8;
          initialsNode.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
          initialsNode.textAlignHorizontal = "CENTER";
          initialsNode.textAlignVertical = "CENTER";
          initialsNode.resize(dotSize, dotSize);
          initialsNode.x = vx - dotSize / 2 + offset;
          initialsNode.y = vy - dotSize / 2;
          frame.appendChild(initialsNode);
        }
      }
    }

    // ── Average marker ──
    const { avgCol, avgRow } = computeVoteAverages(allVotes);
    const avgX = MARGIN + ((avgCol + 0.5) / GRID_COLS) * INNER;
    const avgY = gridOffsetY + MARGIN + ((avgRow + 0.5) / GRID_ROWS) * INNER;

    const haloSize = 36;
    const halo = figma.createEllipse();
    halo.resize(haloSize, haloSize);
    halo.x = avgX - haloSize / 2;
    halo.y = avgY - haloSize / 2;
    halo.fills = [{ type: "SOLID", color: DARK_COLOR }];
    halo.opacity = 0.06;
    frame.appendChild(halo);

    const outerRing = figma.createEllipse();
    const outerSize = 22;
    outerRing.resize(outerSize, outerSize);
    outerRing.x = avgX - outerSize / 2;
    outerRing.y = avgY - outerSize / 2;
    outerRing.fills = [];
    outerRing.strokes = [{ type: "SOLID", color: DARK_COLOR }];
    outerRing.strokeWeight = 1.5;
    outerRing.opacity = 0.6;
    frame.appendChild(outerRing);

    const innerRing = figma.createEllipse();
    const innerSize = 12;
    innerRing.resize(innerSize, innerSize);
    innerRing.x = avgX - innerSize / 2;
    innerRing.y = avgY - innerSize / 2;
    innerRing.fills = [];
    innerRing.strokes = [{ type: "SOLID", color: DARK_COLOR }];
    innerRing.strokeWeight = 1;
    innerRing.opacity = 0.4;
    frame.appendChild(innerRing);

    const centerDot = figma.createEllipse();
    const dotR = 4;
    centerDot.resize(dotR, dotR);
    centerDot.x = avgX - dotR / 2;
    centerDot.y = avgY - dotR / 2;
    centerDot.fills = [{ type: "SOLID", color: DARK_COLOR }];
    frame.appendChild(centerDot);

    const avgLabelNode = figma.createText();
    avgLabelNode.fontName = { family: "Inter", style: "Medium" };
    avgLabelNode.characters = t(lang, "average");
    avgLabelNode.fontSize = 8;
    avgLabelNode.fills = [{ type: "SOLID", color: DARK_COLOR }];
    avgLabelNode.opacity = 0.5;
    avgLabelNode.textAlignHorizontal = "CENTER";
    avgLabelNode.resize(50, 10);
    avgLabelNode.x = avgX - 25;
    avgLabelNode.y = avgY + haloSize / 2 + 2;
    frame.appendChild(avgLabelNode);

    // ── Axis labels ──
    const axisLabels = [
      { text: t(lang, "notUrgent"), x: MARGIN + INNER / 4, y: gridOffsetY + MARGIN - 14, color: AXIS_COLORS.notUrgent.rgb },
      { text: t(lang, "urgent"), x: MARGIN + (INNER * 3) / 4, y: gridOffsetY + MARGIN - 14, color: AXIS_COLORS.urgent.rgb },
    ];

    for (const label of axisLabels) {
      const labelNode = figma.createText();
      labelNode.fontName = { family: "Inter", style: "Bold" };
      labelNode.characters = label.text;
      labelNode.fontSize = 8;
      labelNode.letterSpacing = { value: 1.2, unit: "PIXELS" };
      labelNode.fills = [{ type: "SOLID", color: label.color }];
      labelNode.textAlignHorizontal = "CENTER";
      labelNode.resize(INNER / 2, 12);
      labelNode.x = label.x - INNER / 4;
      labelNode.y = label.y;
      frame.appendChild(labelNode);
    }

    const leftLabels = [
      { text: t(lang, "important"), y: gridOffsetY + MARGIN + INNER / 4, color: AXIS_COLORS.important.rgb },
      { text: t(lang, "notImportant"), y: gridOffsetY + MARGIN + (INNER * 3) / 4, color: AXIS_COLORS.notImportant.rgb },
    ];

    for (const label of leftLabels) {
      const labelNode = figma.createText();
      labelNode.fontName = { family: "Inter", style: "Bold" };
      labelNode.characters = label.text;
      labelNode.fontSize = 7;
      labelNode.letterSpacing = { value: 1, unit: "PIXELS" };
      labelNode.fills = [{ type: "SOLID", color: label.color }];
      labelNode.rotation = -90;
      labelNode.x = MARGIN - 14;
      labelNode.y = label.y;
      frame.appendChild(labelNode);
    }

    // ── Quadrant labels ──
    const quadrantLabels = [
      { text: t(lang, "schedule"), x: MARGIN + INNER / 4, y: gridOffsetY + MARGIN + 8 },
      { text: t(lang, "do"), x: MARGIN + (INNER * 3) / 4, y: gridOffsetY + MARGIN + 8 },
      { text: t(lang, "eliminate"), x: MARGIN + INNER / 4, y: gridOffsetY + MARGIN + INNER / 2 + 8 },
      { text: t(lang, "delegate"), x: MARGIN + (INNER * 3) / 4, y: gridOffsetY + MARGIN + INNER / 2 + 8 },
    ];

    for (const label of quadrantLabels) {
      const labelNode = figma.createText();
      labelNode.fontName = { family: "Inter", style: "Medium" };
      labelNode.characters = label.text;
      labelNode.fontSize = 9;
      labelNode.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
      labelNode.opacity = 0.2;
      labelNode.textAlignHorizontal = "CENTER";
      labelNode.resize(INNER / 2, 14);
      labelNode.x = label.x - INNER / 4;
      labelNode.y = label.y;
      frame.appendChild(labelNode);
    }

    // ── Result label ──
    const resultLabel = t(lang, getQuadrantKey(avgCol, avgRow));
    const resultNode = figma.createText();
    resultNode.fontName = { family: "Inter", style: "Bold" };
    resultNode.characters = `${t(lang, "result")} : ${resultLabel}`;
    resultNode.fontSize = 12;
    resultNode.fills = [{ type: "SOLID", color: DARK_COLOR }];
    resultNode.textAlignHorizontal = "CENTER";
    resultNode.resize(IMG_SIZE, 16);
    resultNode.x = 0;
    resultNode.y = gridOffsetY + MARGIN + INNER + 12;
    frame.appendChild(resultNode);

    figma.currentPage.appendChild(frame);
    figma.viewport.scrollAndZoomIntoView([frame]);
  }

  // ─── Render grid ───────────────────────────────────────────────────────

  function renderCell(col: number, row: number) {
    const cellVotes = voteByCellMap?.get(`${col}:${row}`) || [];

    return (
      <AutoLayout
        key={`${col}-${row}`}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill={CELL_COLORS[row][col]}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        onClick={locked ? undefined : () => placeVote(col, row)}
        hoverStyle={locked ? {} : { opacity: 0.75 }}
        tooltip={locked ? t(lang, "tooltipLocked") : t(lang, "tooltipVote")}
      >
        {cellVotes.length > 0 && (
          <Frame width={CELL_SIZE} height={CELL_SIZE}>
            {cellVotes.map(({ key, vote, index }, i) => {
              const dotSize = 26;
              const offset = cellVotes.length > 1 ? (i - (cellVotes.length - 1) / 2) * 10 : 0;
              const posX = (CELL_SIZE - dotSize) / 2 + offset;
              const posY = (CELL_SIZE - dotSize) / 2;

              return (
                <AutoLayout
                  key={key}
                  width={dotSize}
                  height={dotSize}
                  cornerRadius={dotSize / 2}
                  fill={getDotColor(index)}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  x={posX}
                  y={posY}
                  effect={{
                    type: "drop-shadow",
                    color: { r: 0, g: 0, b: 0, a: 0.25 },
                    offset: { x: 0, y: 1 },
                    blur: 3,
                  }}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  tooltip={vote.userName}
                >
                  <Text fontSize={8} fontWeight={700} fill="#FFFFFF">
                    {getInitials(vote.userName)}
                  </Text>
                </AutoLayout>
              );
            })}
          </Frame>
        )}
      </AutoLayout>
    );
  }

  const SEP_SIZE = 1;
  const SEP_COLOR = "#00000018";
  const midCol = GRID_COLS / 2;
  const midRow = GRID_ROWS / 2;

  function renderGridRow(row: number) {
    const cells = [];
    for (let col = 0; col < GRID_COLS; col++) {
      if (col === midCol) {
        cells.push(
          <AutoLayout key={`vsep-${row}`} width={SEP_SIZE} height={CELL_SIZE} fill={SEP_COLOR} />
        );
      }
      cells.push(renderCell(col, row));
    }
    return (
      <AutoLayout key={`row-${row}`} direction="horizontal" spacing={0}>
        {cells}
      </AutoLayout>
    );
  }

  function renderGrid() {
    const rows = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      if (row === midRow) {
        rows.push(
          <AutoLayout key="hsep" width={GRID_WIDTH + SEP_SIZE} height={SEP_SIZE} fill={SEP_COLOR} />
        );
      }
      rows.push(renderGridRow(row));
    }
    return (
      <AutoLayout direction="vertical" spacing={0}>
        {rows}
      </AutoLayout>
    );
  }

  // ─── Compute average label ─────────────────────────────────────────────

  let avgLabel = "";
  if (showVotes && voterCount > 0) {
    const { avgCol, avgRow } = computeVoteAverages(allVotes);
    avgLabel = t(lang, getQuadrantKey(avgCol, avgRow));
  }

  // ─── Main layout ──────────────────────────────────────────────────────

  return (
    <AutoLayout
      direction="vertical"
      spacing={0}
      cornerRadius={16}
      overflow="hidden"
      effect={{
        type: "drop-shadow",
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 4 },
        blur: 16,
      }}
    >
      {/* Title bar */}
      <AutoLayout
        direction="vertical"
        spacing={6}
        padding={{ vertical: 14, horizontal: 20 }}
        fill="#F9FAFB"
        width={TOTAL_WIDTH}
        horizontalAlignItems="center"
      >
        <Text fontSize={18} fontWeight={800} fill="#1F2937" letterSpacing={0.5}>
          {t(lang, "title")}
        </Text>
        <Input
          value={topic}
          placeholder={t(lang, "placeholder")}
          onTextEditEnd={(e) => setTopic(e.characters)}
          inputBehavior="truncate"
          fontSize={13}
          fill="#6B7280"
          width={300}
          horizontalAlignText="center"
          inputFrameProps={{
            padding: { vertical: 4, horizontal: 12 },
            cornerRadius: 6,
            fill: "#E5E7EB",
          }}
        />
      </AutoLayout>

      {/* Status bar */}
      <AutoLayout
        direction="horizontal"
        spacing={12}
        padding={{ vertical: 8, horizontal: 20 }}
        fill="#F3F4F6"
        width={TOTAL_WIDTH}
        horizontalAlignItems="center"
        verticalAlignItems="center"
      >
        <AutoLayout
          cornerRadius={10}
          padding={{ vertical: 2, horizontal: 10 }}
          fill={voterCount > 0 ? AXIS_COLORS.notUrgent.hex : AXIS_COLORS.notImportant.hex}
        >
          <Text fontSize={11} fontWeight={700} fill="#FFFFFF">
            {formatVoteCount(voterCount, lang)}
          </Text>
        </AutoLayout>

        {showVotes && avgLabel !== "" && (
          <AutoLayout
            cornerRadius={10}
            padding={{ vertical: 2, horizontal: 10 }}
            fill={AXIS_COLORS.important.hex}
          >
            <Text fontSize={11} fontWeight={700} fill="#FFFFFF">
              {`${t(lang, "result")} : ${avgLabel}`}
            </Text>
          </AutoLayout>
        )}

        {!showVotes && voterCount > 0 && (
          <Text fontSize={11} fill="#6B7280">
            {t(lang, "selectReveal")}
          </Text>
        )}
      </AutoLayout>

      {/* Axis labels row */}
      <AutoLayout
        direction="horizontal"
        spacing={0}
        width={TOTAL_WIDTH}
      >
        <AutoLayout width={AXIS_LABEL_SIZE} height={AXIS_LABEL_SIZE} fill="#F9FAFB" />
        <AutoLayout
          width={GRID_WIDTH / 2}
          height={AXIS_LABEL_SIZE}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          fill="#F9FAFB"
        >
          <Text fontSize={10} fontWeight={700} fill={AXIS_COLORS.notUrgent.hex} letterSpacing={1.5}>
            {t(lang, "notUrgent")}
          </Text>
        </AutoLayout>
        <AutoLayout
          width={GRID_WIDTH / 2}
          height={AXIS_LABEL_SIZE}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          fill="#F9FAFB"
        >
          <Text fontSize={10} fontWeight={700} fill={AXIS_COLORS.urgent.hex} letterSpacing={1.5}>
            {t(lang, "urgent")}
          </Text>
        </AutoLayout>
        <AutoLayout width={AXIS_LABEL_SIZE} height={AXIS_LABEL_SIZE} fill="#F9FAFB" />
      </AutoLayout>

      {/* Matrix area */}
      <AutoLayout direction="horizontal" spacing={0} width={TOTAL_WIDTH}>
        <AutoLayout
          direction="vertical"
          width={AXIS_LABEL_SIZE}
          height={GRID_HEIGHT}
          fill="#F9FAFB"
          horizontalAlignItems="center"
        >
          <AutoLayout
            width={AXIS_LABEL_SIZE}
            height={GRID_HEIGHT / 2}
            horizontalAlignItems="center"
            verticalAlignItems="center"
          >
            <Text
              fontSize={10}
              fontWeight={700}
              fill={AXIS_COLORS.important.hex}
              rotation={-90}
              letterSpacing={1.5}
            >
              {t(lang, "important")}
            </Text>
          </AutoLayout>
          <AutoLayout
            width={AXIS_LABEL_SIZE}
            height={GRID_HEIGHT / 2}
            horizontalAlignItems="center"
            verticalAlignItems="center"
          >
            <Text
              fontSize={10}
              fontWeight={700}
              fill={AXIS_COLORS.notImportant.hex}
              rotation={-90}
              letterSpacing={1.5}
            >
              {t(lang, "notImportant")}
            </Text>
          </AutoLayout>
        </AutoLayout>

        <AutoLayout direction="vertical" spacing={0} width="fill-parent">
          {renderGrid()}
        </AutoLayout>

        <AutoLayout width={AXIS_LABEL_SIZE} height={GRID_HEIGHT} fill="#F9FAFB" />
      </AutoLayout>

      {/* Footer */}
      <AutoLayout
        direction="horizontal"
        width={TOTAL_WIDTH}
        padding={{ vertical: 10, horizontal: 20 }}
        fill="#F3F4F6"
        horizontalAlignItems="center"
      >
        <Text fontSize={11} fill={locked ? AXIS_COLORS.urgent.hex : AXIS_COLORS.notImportant.hex}>
          {locked ? t(lang, "votesLocked") : t(lang, "clickToVote")}
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(EisenhowerMatrix);
