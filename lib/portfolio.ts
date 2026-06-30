export type PortfolioType = "short-film" | "tiktok" | "photography";

export type PortfolioFilter = "all" | PortfolioType;

export type PortfolioItem = {
  id: string;
  type: PortfolioType;
  src: string;
  previewSrc?: string;
  watchUrl?: string;
  ratio: number;
};

export type LocalizedPortfolioItem = PortfolioItem & {
  title: string;
  category: string;
  alt: string;
};

type TranslateFn = (
  key: string,
  values?: Record<string, string | number>
) => string;

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "ai-tar-over-verden",
    type: "short-film",
    src: "/images/ai-tar-over-verden-thumbnail.jpeg",
    previewSrc: "/videos/ai-tar-over-verden-film.mp4",
    watchUrl:
      "https://www.tiktok.com/@toppetasjen.films/video/7561120711612321046",
    ratio: 16 / 9,
  },
  {
    id: "mann-pa-bussen",
    type: "tiktok",
    src: "/images/mann-pa-bussen-thumbnail.png",
    previewSrc: "/videos/mann-pa-bussen-film.mp4",
    ratio: 4 / 5,
  },
  {
    id: "danny-cutie",
    type: "photography",
    src: "/images/danny-cutie.jpg",
    ratio: 4 / 5,
  },
];

export function localizePortfolioItem(
  item: PortfolioItem,
  t: TranslateFn
): LocalizedPortfolioItem {
  return {
    ...item,
    title: t(`items.${item.id}.title`),
    category: t(`items.${item.id}.category`),
    alt: t(`items.${item.id}.alt`),
  };
}

export function localizePortfolioItems(
  items: PortfolioItem[],
  t: TranslateFn
) {
  return items.map((item) => localizePortfolioItem(item, t));
}

export function filterPortfolioItems(
  items: LocalizedPortfolioItem[],
  filter: PortfolioFilter
) {
  if (filter === "all") {
    return items;
  }

  return items.filter((item) => item.type === filter);
}

export function groupPortfolioItems(items: LocalizedPortfolioItem[]) {
  return {
    shortFilms: items.filter((item) => item.type === "short-film"),
    tiktok: items.filter((item) => item.type === "tiktok"),
    photography: items.filter((item) => item.type === "photography"),
  };
}

export function getPortfolioPreview(items: LocalizedPortfolioItem[]) {
  return items
    .filter((item) => item.type === "short-film" || item.type === "photography")
    .slice(0, 5);
}

export const PORTFOLIO_PREVIEW = PORTFOLIO_ITEMS.filter(
  (item) => item.type === "short-film" || item.type === "photography"
).slice(0, 5);

export function isPortfolioVideo(item: PortfolioItem) {
  return item.type !== "photography";
}

export function getPortfolioPreviewSrc(item: PortfolioItem) {
  if (!isPortfolioVideo(item)) return undefined;
  return item.previewSrc;
}

export function hasPortfolioWatchLink(item: PortfolioItem) {
  return Boolean(item.watchUrl);
}

export function getPortfolioWatchLabel(item: PortfolioItem, t: TranslateFn) {
  if (item.watchUrl) {
    try {
      const host = new URL(item.watchUrl).hostname.replace(/^www\./, "");

      if (host.includes("tiktok.com")) return t("watch.tikTok");
      if (host.includes("youtube.com") || host === "youtu.be") {
        return t("watch.youTube");
      }
      if (host.includes("vimeo.com")) return t("watch.vimeo");
      if (host.includes("instagram.com")) return t("watch.instagram");
    } catch {
      // Fall through to generic labels below.
    }
  }

  if (item.type === "tiktok") return t("watch.tikTok");
  return t("watch.theFilm");
}

export function getPortfolioFullMovieLabel(item: PortfolioItem, t: TranslateFn) {
  if (item.watchUrl) {
    try {
      const host = new URL(item.watchUrl).hostname.replace(/^www\./, "");

      if (host.includes("tiktok.com")) return t("watch.fullMovieTikTok");
      if (host.includes("youtube.com") || host === "youtu.be") {
        return t("watch.fullMovieYouTube");
      }
      if (host.includes("vimeo.com")) return t("watch.fullMovieVimeo");
      if (host.includes("instagram.com")) return t("watch.fullMovieInstagram");
    } catch {
      // Fall through to generic labels below.
    }
  }

  if (item.type === "tiktok") return t("watch.fullMovieTikTok");
  return t("watch.fullFilm");
}
