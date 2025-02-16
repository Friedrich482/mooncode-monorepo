const timeFormatter = (value: number) => {
  const seconds = value!;
  const minutes = Math.floor((seconds % 3600) / 60);
  const hours = Math.floor(seconds / 3600);

  return (
    <div className="flex flex-1 items-center justify-between gap-1 leading-none">
      <div className="size-3 rounded-sm bg-[var(--color-time)]" />
      <span className="text-muted-foreground">
        Time:{" "}
        {`${hours ? `${hours} hr${hours !== 1 ? "s" : ""} ` : ""}${minutes} min${minutes !== 1 ? "s" : ""}`}
      </span>
    </div>
  );
};

export default timeFormatter;
