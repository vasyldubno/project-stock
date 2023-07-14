export function isNegative(num: number | undefined | null) {
  if (typeof num === "number") {
    if (Math.sign(num) === -1) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}
