const formatDuration = (seconds: number) => {
  const minutes = Math.floor((seconds % 3600) / 60);
  const hours = Math.floor(seconds / 3600);

  return `${hours ? `${hours} hr${hours !== 1 ? "s" : ""} ` : ""}${minutes} min${minutes !== 1 ? "s" : ""}`;
};

export default formatDuration;
