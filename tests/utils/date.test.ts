import { getRange } from "../../src/utils/date";

const ranges = [
  { start: 5, end: 10 },
  { start: 15, end: 20 },
];
// const result = getRange(6, ranges, 4, [3, 15]);
// console.log(result); // Output: false

describe("util date getRange test", () => {
  test("스케줄이 없는 숫자를 선택한 경우", () => {
    expect(getRange(11, ranges, 4, [3, 25])).toStrictEqual([11, 15]);
  });

  test("숫자가 전체 범위에서 아래로 넘어간 경우 ", () => {
    expect(getRange(2, ranges, 4, [3, 25])).toBe(false);
  });

  test("숫자가 전체 범위에서 위로 넘어간 경우", () => {
    expect(getRange(28, ranges, 4, [3, 25])).toBe(false);
  });

  test("숫자가 종료 지점이 width와 맞지 않을 경우", () => {
    expect(getRange(13, ranges, 4, [3, 25])).toStrictEqual([13, 15]);
  });

  test("숫자가 스케줄링 된 범위 안에 있을 경우", () => {
    expect(getRange(17, ranges, 4, [3, 25])).toBe(false);
  });
});
