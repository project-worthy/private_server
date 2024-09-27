import { getSelectRange } from "../../src/utils/date";
const ranges = [
  { start: 5, end: 10 },
  { start: 15, end: 20 },
];

describe("util date getRange test", () => {
  test("스케줄이 없는 숫자를 선택한 경우", () => {
    expect(getSelectRange(11, ranges, 4, [3, 25])).toStrictEqual([11, 15]);
  });
  test("숫자가 전체 범위에서 아래로 넘어간 경우 ", () => {
    expect(getSelectRange(2, ranges, 4, [3, 25])).toBe(false);
  });
  test("숫자가 전체 범위에서 위로 넘어간 경우", () => {
    expect(getSelectRange(28, ranges, 4, [3, 25])).toBe(false);
  });
  test("숫자가 종료 지점이 width와 맞지 않을 경우", () => {
    expect(getSelectRange(13, ranges, 4, [3, 25])).toStrictEqual([13, 15]);
  });
  test("숫자가 스케줄링 된 범위 안에 있을 경우", () => {
    expect(getSelectRange(17, ranges, 4, [3, 25])).toBe(false);
  });
});
