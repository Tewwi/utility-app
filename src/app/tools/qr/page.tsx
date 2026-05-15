import { ToolPageShell } from "@/components/qr/tool-page-shell";
import { getUtilityByHref } from "@/lib/get-utility-by-href";
import { toolPages } from "@/lib/tool-pages";

export default function QrToolPage() {
  const config = toolPages.qr;
  const utility = getUtilityByHref(config.href);

  if (!utility) return null;

  return <ToolPageShell utility={utility} {...config} />;
}
