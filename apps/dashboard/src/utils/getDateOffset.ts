const getDateOffset = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const diffMs = compareDate.getTime() - today.getTime();

  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
};

export default getDateOffset;
