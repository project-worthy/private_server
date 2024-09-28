import { getSelectRange, isActiveTimeIntersect } from "../../src/utils/date";
const ranges = [
  { key: "", start: 5, end: 10 },
  { key: "", start: 15, end: 20 },
];

describe("util date getRange test", () => {
  test("스케줄이 없는 숫자를 선택한 경우", () => {
    expect(getSelectRange(11, ranges, 4, [3, 25])).toStrictEqual({
      start: 11,
      end: 15,
    });
  });
  test("숫자가 전체 범위에서 아래로 넘어간 경우 ", () => {
    expect(getSelectRange(2, ranges, 4, [3, 25])).toBe(false);
  });
  test("숫자가 전체 범위에서 위로 넘어간 경우", () => {
    expect(getSelectRange(28, ranges, 4, [3, 25])).toBe(false);
  });
  test("숫자가 종료 지점이 width와 맞지 않을 경우", () => {
    expect(getSelectRange(13, ranges, 4, [3, 25])).toStrictEqual({
      start: 13,
      end: 15,
    });
  });
  test("숫자가 스케줄링 된 범위 안에 있을 경우", () => {
    expect(getSelectRange(17, ranges, 4, [3, 25])).toStrictEqual({
      start: 20,
      end: 21,
    });
  });
});

describe("util get isActiveTimeIntersect", () => {
  test("타겟 범위가 범위 배열의 요소를 포함하는 경우", () => {
    expect(isActiveTimeIntersect({ start: 0, end: 25 }, ranges)).toBe(true);
  });
  test("타겟 범위가 범위 배열의 요소 하나를 포함하는 경우", () => {
    expect(isActiveTimeIntersect({ start: 0, end: 15 }, ranges)).toBe(true);
  });
});
