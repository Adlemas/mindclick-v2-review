import { randItem } from './multiply';

const divide = (
  first: string,
  second: string,
  { remainder }: { remainder: number },
) => {
  // FIRST * SECOND = ANSWER
  // ABC * D = ANSWER
  // ABC = ANSWER * D
  // D = random
  // ANSWER = random
  // ANSWER LENGTH = D LENGTH

  const numbers = [2, 3, 4, 5, 6, 7, 8, 9];

  const fLen = first.length;
  const sLen = second.length;
  let answerLen = randItem([second.length + (fLen - sLen), sLen + 1]);

  while (
    String(Number('9'.repeat(sLen)) * Number('9'.repeat(answerLen))).length <
    fLen
  ) {
    answerLen += 1;
  }
  while (
    String(Number('9'.repeat(sLen)) * Number('9'.repeat(answerLen))).length >
    fLen
  ) {
    answerLen -= 1;
  }

  let sNum = '';
  let answer = '';

  for (let i = 0; i < sLen; i += 1) {
    sNum += String(randItem(numbers));
  }

  let countLoop = 0;

  do {
    countLoop += 1;
    if (countLoop > 50) {
      sNum = '';
      for (let i = 0; i < sLen; i += 1) {
        sNum += String(randItem(numbers));
      }
      countLoop = 0;
    }
    answer = '';
    for (let i = 0; i < answerLen; i += 1) {
      answer += String(randItem(numbers));
    }
    if (remainder && remainder > 0) {
      answer += '.';
      for (let i = 0; i < remainder; i += 1) {
        answer += String(randItem(numbers));
      }
    }
  } while (String(Number(sNum) * Number(answer)).length !== fLen);

  const fNum = String(Number(answer) * Number(sNum));

  return {
    first: fNum,
    second: sNum,
  };
};

export default divide;
