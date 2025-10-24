import { alpha, createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

export const customPalette = {
  primary: {
    main: '#7373C4',
    dark: '#4B4B9C',
    light: '#C4C4F4',
    contrastText: '#000',
  },
  text: {
    primary: '#000000',
    secondary: '#555555',
    disabled: '#9E9E9E',
  },
  secondary: {
    light: alpha('#d7d7d7', 0.2),
    main: '#7d7d81',
    dark: '#17171a',
    contrastText: '#000',
  },
  background: {
    default: '#FFFFFF', // color/background/default
    paper: '#FFFFFF',
    surface: '#F9F9F9',
  },
} as const;

export const shadowStyles = {
  section: {
    boxShadow: `-2px 2px 8px ${alpha('#000', 0.25)}`,
  },
} as const;

export const radius = {
  small: '12px',
  medium: '16px',
  large: '24px',
  full: '9999px',
} as const;

const outlinedInputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: radius.small,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '&:not(:hover) .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
};
const inputStyles = {
  background: customPalette.secondary.light,
  borderRadius: radius.small,
};
const variantsWithNoBorders = (['outlined', 'filled', 'standard'] as const).map(
  (variant) => ({
    props: { variant },
    style: outlinedInputStyles,
  })
);

const containedStyle = {
  color: customPalette.primary.contrastText,
  backgroundColor: customPalette.primary.light,
  '&:hover': {
    backgroundColor: alpha(customPalette.primary.light, 0.8),
    color: customPalette.primary.contrastText,
    boxShadow: '0px 0px',
  },
};

export const backgroundWithBackdrop = {
  background: alpha(customPalette.background.paper, 0.9),
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)', // For Safari support
};

// TODO: define spacings
export const theme = createTheme({
  palette: {
    ...customPalette,
    text: {
      primary: customPalette.primary.contrastText,
      secondary: customPalette.secondary.contrastText,
    },
  },
  typography: {
    fontSize: 14,
    h1: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    subtitle1: {
      fontSize: '0.875rem',
    },
    subtitle2: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.small,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: radius.small,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': containedStyle,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: customPalette.primary.dark,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          ...backgroundWithBackdrop,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.medium,
          ...backgroundWithBackdrop,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#000', 0.2), // Lighter backdrop for better blur visibility
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: inputStyles,
      },
      variants: variantsWithNoBorders,
    },
    MuiSelect: {
      styleOverrides: {
        root: inputStyles,
      },
      variants: variantsWithNoBorders,
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: radius.small,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          background: customPalette.secondary.light,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&:before': {
            borderBottomColor: grey[500],
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottomColor: grey[700],
          },
          '&.Mui-focused:after': {
            borderBottomColor: grey[900],
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: containedStyle,
        },
        {
          props: { variant: 'outlined' },
          style: {
            color: customPalette.primary.main,
            borderColor: customPalette.primary.main,
            '&:hover': {
              backgroundColor: customPalette.primary.light,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          borderRadius: radius.medium,
          boxShadow: 'none',
        },
      },
    },
  },
});
