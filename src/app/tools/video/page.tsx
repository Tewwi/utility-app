import { getUtilityByHref } from "@/lib/get-utility-by-href";
import { toolPages } from "@/lib/tool-pages";
import { VideoExtractor } from "../../../components/video/video-extractor";

export default function VideoToolPage() {
  const config = toolPages.video;
  const utility = getUtilityByHref(config.href);

  if (!utility) return null;

  return (
    <VideoExtractor
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
