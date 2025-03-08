const getDayWithOffset = (offset: number) => {
  const today = new Date();
  return new Date(today.setDate(today.getDate() - offset)).toLocaleString();
};

export default getDayWithOffset;
