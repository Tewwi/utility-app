import { getUtilityByHref } from "@/lib/get-utility-by-href";
import { toolPages } from "@/lib/tool-pages";
import { PdfWordSearchTool } from "@/components/pdf-word-search/pdf-word-search-tool";

export default function PdfWordSearchPage() {
  const config = toolPages.pdfWordSearch;
  const utility = getUtilityByHref(config.href);

  if (!utility) return null;

  return (
    <PdfWordSearchTool
      utility={{
        title: utility.title,
        description: utility.description,
        category: utility.category,
        accent: utility.accent,
      }}
      details={config.details}
    />
  );
}
