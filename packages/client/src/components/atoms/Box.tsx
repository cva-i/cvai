import { Box as BoxMui, styled } from '@mui/material';

export const Box = styled(BoxMui)(() => ({
  overflow: 'auto',
  scrollbarWidth: 'none' /* Firefox */,
  msOverflowStyle: 'none' /* IE/Edge */,
  '&::-webkit-scrollbar': {
    /* WebKit */ display: 'none',
  },
}));

export const CenteredBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});

export const RowLayout = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
});

export const ColumnLayout = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});
