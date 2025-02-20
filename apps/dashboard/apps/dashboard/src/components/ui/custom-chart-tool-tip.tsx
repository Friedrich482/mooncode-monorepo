import formatDuration from "@/utils/formatDuration";

const CustomChartToolTip = (value: number) => {
  return (
    <div className="flex flex-1 items-center justify-between gap-1 leading-none">
      <div className="size-3 rounded-sm bg-[var(--color-time)]" />
      <span className="text-muted-foreground">
        Time: {formatDuration(value)}
      </span>
    </div>
  );
};

export default CustomChartToolTip;
