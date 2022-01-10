import type { Theme } from 'theme-ui';
// @ts-ignore
import * as carbonplanTheme from '@carbonplan/theme';

export const theme: Theme = {
  ...carbonplanTheme,
  colors: {
    ...carbonplanTheme.colors,
    text: 'white',
    background: 'black',
    'button-background': 'gray',
    primary: 'white',
  },
  buttons: {
    primary: {
      color: 'background',
      bg: 'button-background',
      '&:hover': {
        bg: 'primary',
        cursor: 'pointer',
      },
    },
    secondary: {
      color: 'background',
      bg: 'secondary',
    },
  },
};
