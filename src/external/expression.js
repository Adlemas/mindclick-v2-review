/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import fs from 'fs';

const NF = JSON.parse(fs.readFileSync('./lib/nf.json'));
const LF = JSON.parse(fs.readFileSync('./lib/lf.json'));
const BF = JSON.parse(fs.readFileSync('./lib/bf.json'));
const FF = JSON.parse(fs.readFileSync('./lib/ff.json'));

const p1p5m4 = JSON.parse(fs.readFileSync('./lib/+1=+5-4.json'));
const p2p5m3 = JSON.parse(fs.readFileSync('./lib/+2=+5-3.json'));
const p3p5m2 = JSON.parse(fs.readFileSync('./lib/+3=+5-2.json'));
const p4p5m1 = JSON.parse(fs.readFileSync('./lib/+4=+5-1.json'));
const m1p4m5 = JSON.parse(fs.readFileSync('./lib/-1=+4-5.json'));
const m2p3m5 = JSON.parse(fs.readFileSync('./lib/-2=+3-5.json'));
const m3p2m5 = JSON.parse(fs.readFileSync('./lib/-3=+2-5.json'));
const m4p1m5 = JSON.parse(fs.readFileSync('./lib/-4=+1-5.json'));
const p1m9p10 = JSON.parse(fs.readFileSync('./lib/+1=-9+10.json'));
const p2m8p10 = JSON.parse(fs.readFileSync('./lib/+2=-8+10.json'));
const p3m7p10 = JSON.parse(fs.readFileSync('./lib/+3=-7+10.json'));
const p4m6p10 = JSON.parse(fs.readFileSync('./lib/+4=-6+10.json'));
const p5m5p10 = JSON.parse(fs.readFileSync('./lib/+5=-5+10.json'));
const p6m4p10 = JSON.parse(fs.readFileSync('./lib/+6=-4+10.json'));
const p7m3p10 = JSON.parse(fs.readFileSync('./lib/+7=-3+10.json'));
const p8m2p10 = JSON.parse(fs.readFileSync('./lib/+8=-2+10.json'));
const p9m1p10 = JSON.parse(fs.readFileSync('./lib/+9=-1+10.json'));
const m1m10p9 = JSON.parse(fs.readFileSync('./lib/-1=-10+9.json'));
const m2m10p8 = JSON.parse(fs.readFileSync('./lib/-2=-10+8.json'));
const m3m10p7 = JSON.parse(fs.readFileSync('./lib/-3=-10+7.json'));
const m4m10p6 = JSON.parse(fs.readFileSync('./lib/-4=-10+6.json'));
const m5m10p5 = JSON.parse(fs.readFileSync('./lib/-5=-10+5.json'));
const m6m10p4 = JSON.parse(fs.readFileSync('./lib/-6=-10+4.json'));
const m7m10p3 = JSON.parse(fs.readFileSync('./lib/-7=-10+3.json'));
const m8m10p2 = JSON.parse(fs.readFileSync('./lib/-8=-10+2.json'));
const m9m10p1 = JSON.parse(fs.readFileSync('./lib/-9=-10+1.json'));

const p6p1m5p10 = JSON.parse(fs.readFileSync('./lib/+6=+1-5+10.json'));
const m6m10p5m1 = JSON.parse(fs.readFileSync('./lib/-6=-10+5-1.json'));
const p7p2m5p10 = JSON.parse(fs.readFileSync('./lib/+7=+2-5+10.json'));
const m7m10p5m2 = JSON.parse(fs.readFileSync('./lib/-7=-10+5-2.json'));
const p8p3m5p10 = JSON.parse(fs.readFileSync('./lib/+8=+3-5+10.json'));
const m8m10p5m3 = JSON.parse(fs.readFileSync('./lib/-8=-10+3-5.json'));
const p9p4m5p10 = JSON.parse(fs.readFileSync('./lib/+9=+4-5+10.json'));
const m9m10p5m4 = JSON.parse(fs.readFileSync('./lib/-9=-10+5-4.json'));

const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const nf_expression = (terms_length, min, max) =>
  Expression(terms_length, min, max, nf_term);

const nf_term = (num, isAdditive, max_num_len, isHard, isRepeat, max) =>
  check(num, isAdditive, max_num_len, NF, isHard, isRepeat, max);

const lf_expression = (terms_length, min, max) =>
  Expression(terms_length, min, max, lf_term);

const lf_term = (num, isAdditive, max_num_len) =>
  check(num, isAdditive, max_num_len, LF);

const bf_expression = (terms_length, min, max, isBiggerMax) =>
  Expression(terms_length, min, max, bf_term, isBiggerMax);

const bf_term = (num, isAdditive, max_num_len, isHard) =>
  check(num, isAdditive, max_num_len, BF, isHard);

const ff_expression = (terms_length, min, max) =>
  Expression(terms_length, min, max, ff_term, true);

const ff_term = (num, isAdditive, max_num_len) =>
  check(num, isAdditive, max_num_len, FF, true);

const sub_expression = (terms_length, min, max, sub_name) =>
  Expression(terms_length, min, max, SUB_TERMS[sub_name]()[0], true);

const SUB_TERMS = {
  '+1=+5-4': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p1p5m4, isHard, isRepeat, max, min),
    false,
  ],
  '+2=+5-3': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p2p5m3, isHard, isRepeat, max, min),
    false,
  ],
  '+3=+5-2': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p3p5m2, isHard, isRepeat, max, min),
    false,
  ],
  '+4=+5-1': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p4p5m1, isHard, isRepeat, max, min),
    false,
  ],
  '-1=+4-5': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m1p4m5, isHard, isRepeat, max, min),
    false,
  ],
  '-2=+3-5': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m2p3m5, isHard, isRepeat, max, min),
    false,
  ],
  '-3=+2-5': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m3p2m5, isHard, isRepeat, max, min),
    false,
  ],
  '-4=+1-5': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m4p1m5, isHard, isRepeat, max, min),
    false,
  ],
  '+1=-9+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p1m9p10, isHard, isRepeat, max, min),
    true,
  ],
  '+2=-8+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p2m8p10, isHard, isRepeat, max, min),
    true,
  ],
  '+3=-7+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p3m7p10, isHard, isRepeat, max, min),
    true,
  ],
  '+4=-6+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p4m6p10, isHard, isRepeat, max, min),
    true,
  ],
  '+5=-5+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p5m5p10, isHard, isRepeat, max, min),
    true,
  ],
  '+6=-4+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p6m4p10, isHard, isRepeat, max, min),
    true,
  ],
  '+7=-3+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p7m3p10, isHard, isRepeat, max, min),
    true,
  ],
  '+8=-2+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p8m2p10, isHard, isRepeat, max, min),
    true,
  ],
  '+9=-1+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, p9m1p10, isHard, isRepeat, max, min),
    true,
  ],
  '-1=-10+9': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m1m10p9, isHard, isRepeat, max, min),
    true,
  ],
  '-2=-10+8': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m2m10p8, isHard, isRepeat, max, min),
    true,
  ],
  '-3=-10+7': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m3m10p7, isHard, isRepeat, max, min),
    true,
  ],
  '-4=-10+6': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m4m10p6, isHard, isRepeat, max, min),
    true,
  ],
  '-5=-10+5': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m5m10p5, isHard, isRepeat, max, min),
    true,
  ],
  '-6=-10+4': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m6m10p4, isHard, isRepeat, max, min),
    true,
  ],
  '-7=-10+3': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m7m10p3, isHard, isRepeat, max, min),
    true,
  ],
  '-8=-10+2': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m8m10p2, isHard, isRepeat, max, min),
    true,
  ],
  '-9=-10+1': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(num, isAdditive, max_num_len, m9m10p1, isHard, isRepeat, max, min),
    true,
  ],
  '+6=+1-5+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(
        num,
        isAdditive,
        max_num_len,
        p6p1m5p10,
        isHard,
        isRepeat,
        max,
        min,
      ),
    true,
  ],
  '-6=-10+5-1': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(
        num,
        isAdditive,
        max_num_len,
        m6m10p5m1,
        isHard,
        isRepeat,
        max,
        min,
      ),
    true,
  ],
  '+7=+2-5+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(
        num,
        isAdditive,
        max_num_len,
        p7p2m5p10,
        isHard,
        isRepeat,
        max,
        min,
      ),
    true,
  ],
  '-7=-10+5-2': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(
        num,
        isAdditive,
        max_num_len,
        m7m10p5m2,
        isHard,
        isRepeat,
        max,
        min,
      ),
    true,
  ],
  '+8=+3-5+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(
        num,
        isAdditive,
        max_num_len,
        p8p3m5p10,
        isHard,
        isRepeat,
        max,
        min,
      ),
    true,
  ],
  '-8=-10+5-3': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(
        num,
        isAdditive,
        max_num_len,
        m8m10p5m3,
        isHard,
        isRepeat,
        max,
        min,
      ),
    true,
  ],
  '+9=+4-5+10': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(
        num,
        isAdditive,
        max_num_len,
        p9p4m5p10,
        isHard,
        isRepeat,
        max,
        min,
      ),
    true,
  ],
  '-9=-10+5-4': () => [
    (num, isAdditive, max_num_len, isHard, isRepeat, max, min) =>
      check(
        num,
        isAdditive,
        max_num_len,
        m9m10p5m4,
        isHard,
        isRepeat,
        max,
        min,
      ),
    true,
  ],
};

const Expression = (terms_length, min_num, max_num, object, isCanBeBigger) => {
  let isTens = false;

  let min;
  let max = 0;

  if (min_num === 10 && max_num === 90) {
    min = 1;
    max = 9;
    isTens = true;
  } else {
    min = min_num;
    max = max_num;
  }

  let terms = [];
  const max_num_len = String(max).length;
  let curNum = 0;
  let isFirst = true;

  let sameOpCount = 0;

  for (let i = 0; i < terms_length; i += 1) {
    let isHard = false;
    let isAdditive = true;
    const number = Math.floor(Math.random() * 4);
    if (number === 2) isAdditive = false;
    if (curNum - min < min) {
      isAdditive = true;
      isHard = true;
    } else if (curNum + min > max && !isCanBeBigger) {
      isAdditive = false;
      isHard = true;
    } else if (sameOpCount >= 1) {
      isAdditive = terms[terms.length - 1] < 0;
      isHard = true;
    }
    let term = object(
      // eslint-disable-next-line no-nested-ternary
      isFirst
        ? '0'.repeat(max_num_len)
        : String(curNum).length < String(min).length
        ? String('0'.repeat(String(min).length - String(curNum).length)) +
          String(curNum)
        : curNum,
      isAdditive,
      max_num_len,
      isHard,
      terms[terms.length - 1],
      max,
      min,
    );
    if (!isHard && term === 0) {
      if (!isAdditive) isAdditive = true;
      else isAdditive = false;
      term = object(
        isFirst ? '0'.repeat(max_num_len) : curNum,
        isAdditive,
        max_num_len,
        isHard,
        terms[terms.length - 1],
        max,
        min,
      );
    } else if (isHard && term === 0) {
      term = object(
        isFirst ? '0'.repeat(max_num_len) : curNum,
        isAdditive,
        max_num_len,
        isHard,
        terms[terms.length - 1],
        max,
        min,
      );
    }
    if (!isAdditive && !isHard && curNum + term === 0) {
      isAdditive = true;
      term = object(
        isFirst ? '0'.repeat(max_num_len) : curNum,
        isAdditive,
        max_num_len,
        isHard,
        terms[terms.length - 1],
        max,
        min,
      );
    }
    if (!isHard && Math.abs(terms[terms.length - 1]) === Math.abs(term)) {
      if (!isAdditive) isAdditive = true;
      else isAdditive = false;
      term = object(
        isFirst ? '0'.repeat(max_num_len) : curNum,
        isAdditive,
        max_num_len,
        isHard,
        true,
        max,
        min,
      );
    } else if (isHard && Math.abs(terms[terms.length - 1]) === Math.abs(term)) {
      if (curNum - min > min && (curNum + min < max || isCanBeBigger)) {
        if (!isAdditive) isAdditive = true;
        else isAdditive = false;
        term = object(
          isFirst ? '0'.repeat(max_num_len) : curNum,
          isAdditive,
          max_num_len,
          isHard,
          true,
          max,
          min,
        );
      }
    }

    while (curNum + term <= 0) {
      isAdditive = true;
      isHard = true;
      term = object(
        isFirst ? '0'.repeat(max_num_len) : curNum,
        isAdditive,
        max_num_len,
        isHard,
        terms[terms.length - 1],
        max,
        min,
      );
    }

    isFirst = false;
    if (terms[terms.length - 1] < 0 && term < 0) sameOpCount += 1;
    else if (terms[terms.length - 1] > 0 && term > 0) sameOpCount += 1;
    else sameOpCount = 0;
    curNum += term;

    terms.push(term);
  }

  if (isTens) {
    const new_terms = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const term of terms) {
      new_terms.push(Number(`${term}0`));
    }
    terms = new_terms;
  }

  return terms;
};

const check = (
  num,
  isAdditive,
  max_num_len,
  object,
  isHard,
  isRepeat,
  max,
  min,
  isStrong,
) => {
  if (!isStrong && isHard === false && object['*'] !== undefined) {
    if (object['*'][0][0] !== -1) {
      for (let i = 0; i < object['*'][0].length; i += 1) {
        if (String(num).includes(String(object['*'][0][i]))) {
          if (object['*'][1] === '+') isAdditive = true;
          else isAdditive = false;
        }
      }
    } else if (num > max) {
      isAdditive = false;
      isHard = true;
      isStrong = true;
    } else {
      isAdditive = true;
      isHard = true;
      isStrong = true;
    }
  } else if (
    !isStrong &&
    isHard === true &&
    isRepeat !== true &&
    object['*'] !== undefined &&
    String(num).includes(String(object['*'][0]))
  ) {
    for (let i = 0; i < object['*'][0].length; i += 1) {
      if (String(num).includes(String(object['*'][0][i]))) {
        if (object['*'][1] === '+') isAdditive = true;
        else isAdditive = false;
      }
    }
  }
  if (
    object['*'] &&
    object['*'][1] !== '+' &&
    !isHard &&
    !isStrong &&
    num > max
  ) {
    isAdditive = false;
  }
  const extraAdd = String(num).length < max_num_len && isAdditive;
  let extraArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (max !== undefined) extraArr = extraArr.filter((el) => el <= max);
  const extraNum = randItem(extraArr);
  let term = extraAdd ? String(extraNum) : '';

  let num_str = String(num);
  if (num_str.length > max_num_len) {
    num_str = num_str.slice(num_str.length - max_num_len);
  }
  if (
    object['*'] &&
    Number(num_str) <= 0 &&
    !isAdditive &&
    object['*'][0][0] !== -1
  ) {
    isAdditive = true;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const digit_str of num_str) {
    const digit = Number(digit_str);
    let plus = object['+'][digit];
    let minus = object['-'][digit];
    if (max !== undefined) plus = plus.filter((el) => el <= max);
    if (max !== undefined) minus = minus.filter((el) => el <= max);
    if (plus?.length < 1) isAdditive = false;
    if (minus?.length < 1) isAdditive = true;
    const add_item = plus ? randItem(plus) : undefined;
    const minus_item = minus ? randItem(minus) : undefined;
    term += String(isAdditive ? add_item : minus_item);
  }

  if (!isAdditive && num - Number(term) < min) {
    return check(
      num,
      true,
      max_num_len,
      object,
      isHard,
      isRepeat,
      max,
      min,
      true,
    );
  }

  if (isRepeat === (isAdditive ? Number(term) : -Number(term))) {
    return check(num, isAdditive, max_num_len, object, isHard, true, max, min);
  }

  return isAdditive ? Number(term) : -Number(term);
};

export const formulas = ['NF', 'LF', 'BF', 'FF'];

const expression = (formula, terms_length, min, max, isBiggerMax) => {
  const form = randItem(formulas);

  switch (formula) {
    case 'NC':
    case 'NF':
      return nf_expression(terms_length, min, max);
    case 'LF':
      return lf_expression(terms_length, min, max);
    case 'BF':
      return bf_expression(terms_length, min, max, true);
    case 'FF':
      return ff_expression(terms_length, min, max, true);
    case 'MIX':
      return expression(form, terms_length, min, max, isBiggerMax);
    case '+1=+5-4':
      return sub_expression(terms_length, min, max, formula);
    case '-1=+4-5':
      return sub_expression(terms_length, min, max, formula);
    case '+2=+5-3':
      return sub_expression(terms_length, min, max, formula);
    case '-2=+3-5':
      return sub_expression(terms_length, min, max, formula);
    case '+3=+5-2':
      return sub_expression(terms_length, min, max, formula);
    case '-3=+2-5':
      return sub_expression(terms_length, min, max, formula);
    case '+4=+5-1':
      return sub_expression(terms_length, min, max, formula);
    case '-4=+1-5':
      return sub_expression(terms_length, min, max, formula);
    case '+1=-9+10':
      return sub_expression(terms_length, min, max, formula);
    case '+2=-8+10':
      return sub_expression(terms_length, min, max, formula);
    case '+3=-7+10':
      return sub_expression(terms_length, min, max, formula);
    case '+4=-6+10':
      return sub_expression(terms_length, min, max, formula);
    case '+5=-5+10':
      return sub_expression(terms_length, min, max, formula);
    case '+6=-4+10':
      return sub_expression(terms_length, min, max, formula);
    case '+7=-3+10':
      return sub_expression(terms_length, min, max, formula);
    case '+8=-2+10':
      return sub_expression(terms_length, min, max, formula);
    case '+9=-1+10':
      return sub_expression(terms_length, min, max, formula);
    case '-1=-10+9':
      return sub_expression(terms_length, min, max, formula);
    case '-2=-10+8':
      return sub_expression(terms_length, min, max, formula);
    case '-3=-10+7':
      return sub_expression(terms_length, min, max, formula);
    case '-4=-10+6':
      return sub_expression(terms_length, min, max, formula);
    case '-5=-10+5':
      return sub_expression(terms_length, min, max, formula);
    case '-6=-10+4':
      return sub_expression(terms_length, min, max, formula);
    case '-7=-10+3':
      return sub_expression(terms_length, min, max, formula);
    case '-8=-10+2':
      return sub_expression(terms_length, min, max, formula);
    case '-9=-10+1':
      return sub_expression(terms_length, min, max, formula);
    case '+6=+1-5+10':
      return sub_expression(terms_length, min, max, formula);
    case '-6=-10+5-1':
      return sub_expression(terms_length, min, max, formula);
    case '+7=+2-5+10':
      return sub_expression(terms_length, min, max, formula);
    case '-7=-10+5-2':
      return sub_expression(terms_length, min, max, formula);
    case '+8=+3-5+10':
      return sub_expression(terms_length, min, max, formula);
    case '-8=-10+5-3':
      return sub_expression(terms_length, min, max, formula);
    case '+9=+4-5+10':
      return sub_expression(terms_length, min, max, formula);
    case '-9=-10+5-4':
      return sub_expression(terms_length, min, max, formula);
    default:
      return [];
  }
};

export default expression;
