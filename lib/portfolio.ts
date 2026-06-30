export type PortfolioType = "short-film" | "tiktok" | "photography";

export type PortfolioFilter = "all" | PortfolioType;

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  type: PortfolioType;
  /** Poster image for video, or the photo itself */
  src: string;
  /** Short preview clip hosted on this site */
  previewSrc?: string;
  /** Link to the full film on TikTok, YouTube, Vimeo, etc. */
  watchUrl?: string;
  alt: string;
  ratio: number;
};

export const PORTFOLIO_FILTERS: { value: PortfolioFilter; label: string }[] = [
  { value: "all", label: "All work" },
  { value: "short-film", label: "Short films" },
  { value: "tiktok", label: "TikTok edits" },
  { value: "photography", label: "Photography" },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "ai-tar-over-verden",
    title: "Ai tar over verden",
    category: "Short film",
    type: "short-film",
    src: "/images/ai-tar-over-verden-thumbnail.jpeg",
    previewSrc: "/videos/ai-tar-over-verden-film.mp4",
    watchUrl: "https://www.tiktok.com/@toppetasjen.films/video/7561120711612321046",
    alt: "Ai tar over verden",
    ratio: 16 / 9,
  },
  
  {
    id: "tiktok-lifestyle",
    title: "Lifestyle montage",
    category: "TikTok edit",
    type: "tiktok",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    previewSrc:
      "https://assets.mixkit.co/videos/preview/mixkit-young-woman-taking-a-selfie-on-top-of-a-mountain-4230-large.mp4",
    alt: "Vertical lifestyle montage with punchy transitions",
    ratio: 9 / 16,
  },
  
  {
    id: "product-still",
    title: "Product launch stills",
    category: "Photography",
    type: "photography",
    src: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80",
    alt: "Photographer adjusting camera settings in studio",
    ratio: 4 / 5,
  },
  {
    id: "portrait-series",
    title: "Executive portrait series",
    category: "Photography",
    type: "photography",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    alt: "Professional portrait in natural light",
    ratio: 4 / 5,
  },
];

export function filterPortfolioItems(
  items: PortfolioItem[],
  filter: PortfolioFilter
) {
  if (filter === "all") {
    return items;
  }

  return items.filter((item) => item.type === filter);
}

export function groupPortfolioItems(items: PortfolioItem[]) {
  return {
    shortFilms: items.filter((item) => item.type === "short-film"),
    tiktok: items.filter((item) => item.type === "tiktok"),
    photography: items.filter((item) => item.type === "photography"),
  };
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

export function getPortfolioWatchLabel(item: PortfolioItem) {
  if (item.watchUrl) {
    try {
      const host = new URL(item.watchUrl).hostname.replace(/^www\./, "");

      if (host.includes("tiktok.com")) return "Watch on TikTok";
      if (host.includes("youtube.com") || host === "youtu.be") {
        return "Watch on YouTube";
      }
      if (host.includes("vimeo.com")) return "Watch on Vimeo";
      if (host.includes("instagram.com")) return "Watch on Instagram";
    } catch {
      // Fall through to generic labels below.
    }
  }

  if (item.type === "tiktok") return "Watch on TikTok";
  return "Watch the film";
}

export function getPortfolioFullMovieLabel(item: PortfolioItem) {
  if (item.watchUrl) {
    try {
      const host = new URL(item.watchUrl).hostname.replace(/^www\./, "");

      if (host.includes("tiktok.com")) return "Full movie on TikTok";
      if (host.includes("youtube.com") || host === "youtu.be") {
        return "Full movie on YouTube";
      }
      if (host.includes("vimeo.com")) return "Full movie on Vimeo";
      if (host.includes("instagram.com")) return "Full movie on Instagram";
    } catch {
      // Fall through to generic labels below.
    }
  }

  if (item.type === "tiktok") return "Full movie on TikTok";
  return "Watch full film";
}
