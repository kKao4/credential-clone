export function findNearestSmallerNumber(x: number, arr: number[]) {
  const arrLength = arr.length;
  for (let i = arrLength - 1; i >= 0; i--) {
    if (arr[i] - x < 0) {
      return arr[i];
    }
    if (arr[0] - x >= 0) {
      return arr[0];
    }
  }
}
