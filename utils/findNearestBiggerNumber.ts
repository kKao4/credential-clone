export function findNearestBiggerNumber(x: number, arr: number[]) {
  const arrLength = arr.length;
  for (let i = 0; i < arrLength; i++) {
    if (i === arrLength - 1 && arr[i] - x <= 0) return arr[i];
    if (arr[i] - x > 0) return arr[i];
  }
}
