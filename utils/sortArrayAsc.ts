export function sortAsc(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}
