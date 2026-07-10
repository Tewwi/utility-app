import type { LucideIcon } from "lucide-react";
import { FileSearch, QrCode, Video } from "lucide-react";

export type UtilityStatus = "Ready" | "Draft";

export type Utility = {
  title: string;
  description: string;
  href: string;
  category: string;
  status: UtilityStatus;
  icon: LucideIcon;
  accent: string;
};

export const utilities: Utility[] = [
  {
    title: "QR Generator",
    description:
      "Create QR codes for links, text snippets, and contact payloads.",
    href: "/tools/qr",
    category: "Content",
    status: "Draft",
    icon: QrCode,
    accent: "bg-primary/10 text-primary",
  },
  {
    title: "Video Preview",
    description:
      "Extract video sources from pasted markup or escaped source text.",
    href: "/tools/video",
    category: "Content",
    status: "Ready",
    icon: Video,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "PDF Word Search",
    description:
      "Search multiple words or phrases across up to 5 PDF files with OCR support for scanned documents.",
    href: "/tools/pdf-word-search",
    category: "Content",
    status: "Draft",
    icon: FileSearch,
    accent: "bg-primary/10 text-primary",
  },
];
