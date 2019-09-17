import * as calc from '../src/index'

test('测试加法', () => {
  expect(calc.add(2, 2)).toEqual(4)
})
test('测试减法', () => {
  expect(calc.sub(4, 2)).toEqual(2)
})
test('测试乘法', () => {
  expect(calc.mul(2, 2)).toEqual(4)
})
test('测试除法', () => {
  expect(calc.div(2, 2)).toEqual(1)
})
test('测试四舍五入', () => {
  expect(calc.round(2.125, 1)).toEqual(2.1)
})
