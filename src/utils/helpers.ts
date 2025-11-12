export function Delay(time: number = 1) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time);
  });
}
