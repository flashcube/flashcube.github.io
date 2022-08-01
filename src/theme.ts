import type { Theme } from 'theme-ui';

export const theme: Theme = {
  colors: {
    red: '#f07071',
    orange: '#ea9755',
    yellow: '#d4c05e',
    green: '#7eb36a',
    teal: '#64b9c4',
    blue: '#85a2f7',
    purple: '#bc85d9',
    pink: '#e587b6',
    grey: '#a9b4c4',
    text: 'white',
    background: 'black',
    primary: 'white',
  },
  buttons: {
    primary: {
      color: 'background',
      bg: 'text',
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
