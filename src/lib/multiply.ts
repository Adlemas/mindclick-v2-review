export const randItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// eslint-disable-next-line max-len
export const getRndInteger = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const isNumeric = (value: string): boolean => /^-?\d+$/.test(value);

const generateMultiply = (
  fSize: number,
  sSize: number,
  firsts: string[],
  seconds: string[],
) => {
  let first = randItem(firsts);
  let second = randItem(seconds);

  let firstTerm = first.split('');
  let secondTerm = second.split('');

  if (first === '*') {
    firstTerm = getRndInteger(
      parseInt('1'.repeat(fSize), 10),
      parseInt('9'.repeat(fSize), 10),
    )
      .toString()
      .split('');
  } else {
    for (let fi = 0; fi < first.length; fi += 1) {
      const key = first[fi];
      if (isNumeric(key)) {
        firstTerm[fi] = key;
      } else {
        let number = getRndInteger(1, 9);
        if (fi === 0) number = getRndInteger(1, 9);
        first = first.replace(key, number.toString());
        firstTerm = firstTerm.map((k) => (k === key ? number.toString() : k));
      }
    }
  }

  if (second === '*') {
    secondTerm = getRndInteger(
      parseInt('1'.repeat(sSize), 10),
      parseInt('9'.repeat(sSize), 10),
    )
      .toString()
      .split('');
  } else {
    for (let si = 0; si < second.length; si += 1) {
      const key = second[si];
      if (isNumeric(key)) {
        secondTerm[si] = key;
      } else {
        let number = getRndInteger(1, 9);
        if (si === 0) number = getRndInteger(1, 9);
        second = second.replace(key, number.toString());
        secondTerm = secondTerm.map((k) => (k === key ? number.toString() : k));
      }
    }
  }

  return {
    first: parseInt(firstTerm.join(''), 10),
    second: parseInt(secondTerm.join(''), 10),
  };
};

export default generateMultiply;
