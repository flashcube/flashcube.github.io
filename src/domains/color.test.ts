import { validateColor } from './color';
test('validateColor', async () => {
  expect(validateColor('white')).toBeTruthy();
  expect(validateColor('WHITE')).toBeTruthy();
  expect(validateColor('#333')).toBeTruthy();
  expect(validateColor('#1234FF')).toBeTruthy();
  expect(validateColor('#1234XX')).toBeFalsy();
  expect(validateColor('exploit code')).toBeFalsy();
});
