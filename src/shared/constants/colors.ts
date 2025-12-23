export const DAILY_COLORS = [
  '#FF6B6B', '#FF8769', '#FFA367', '#FFBF65', '#FFDB63',
  '#F9F871', '#D0F077', '#A7E87D', '#7EE083', '#55D889',
  '#2CCF8F', '#00C695', '#00BC9B', '#00B3A1', '#00A9A7',
  '#009EAD', '#0094B3', '#0089B9', '#007EBF', '#0074C5',
  '#0069CB', '#005ED1', '#0053D7', '#2C48DD', '#4A3CE3',
  '#6830E9', '#8624EF', '#A418F5', '#C20CFB', '#E000FF',
  '#FF00E6'  // Pink
];

export const getDailyColor = (dayNumber: number): string => {
  // dayNumber가 1부터 시작하므로 index는 -1 처리
  // 31일을 넘어가면 다시 처음 색상으로 순환 (Modulo 연산)
  const index = (dayNumber - 1) % DAILY_COLORS.length;
  return DAILY_COLORS[index];
};
