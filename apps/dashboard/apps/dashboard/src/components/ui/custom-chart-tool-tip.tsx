import formatDuration from "@/utils/formatDuration";
import { z } from "zod";

const CustomChartToolTip = (
  value: number,
  color: unknown = "var(--color-time)",
  languageId?: string,
) => {
  const safeColor = (() => {
    try {
      return z.string().min(2).parse(color);
    } catch (e) {
      console.error("Invalid color:", e instanceof Error ? e.message : e);
      return "var(--color-time)";
    }
  })();

  return (
    <div className="flex flex-1 items-center justify-center gap-2 leading-none">
      <div
        className="size-3 rounded-sm"
        style={{
          backgroundColor: safeColor,
        }}
      />
      {languageId && <span>{languageId}</span>}
      <span className="flex-1 text-muted-foreground">
        {!Number.isNaN(value) ? formatDuration(value) : "######"}
      </span>
    </div>
  );
};

export default CustomChartToolTip;
