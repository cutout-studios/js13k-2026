export const dotProduct = <T extends number[]>(left: T, right: T) =>
  left.reduce(
    (result, value, index) => result + value * right[index],
    0,
  );
