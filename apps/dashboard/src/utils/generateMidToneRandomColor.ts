const MIN_VALUE = 50;
const MAX_VALUE = 200;
const generateMidToneRandomColor = (
  options: { minComponentValue: number; maxComponentValue: number } = {
    minComponentValue: MIN_VALUE,
    maxComponentValue: MAX_VALUE,
  },
) => {
  const { minComponentValue, maxComponentValue } = options;

  if (minComponentValue < 0 || minComponentValue > 255) {
    options.minComponentValue = MIN_VALUE;
  }
  if (maxComponentValue < 0 || maxComponentValue > 255) {
    options.maxComponentValue = MAX_VALUE;
  }
  if (minComponentValue >= maxComponentValue) {
    options.minComponentValue = MIN_VALUE;
    options.maxComponentValue = MAX_VALUE;
  }

  const r = getRandomInt(options.minComponentValue, options.maxComponentValue);
  const g = getRandomInt(options.minComponentValue, options.maxComponentValue);
  const b = getRandomInt(options.minComponentValue, options.maxComponentValue);

  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default generateMidToneRandomColor;
