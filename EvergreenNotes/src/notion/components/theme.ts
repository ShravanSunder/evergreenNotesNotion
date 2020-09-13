import { createMuiTheme, Theme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { lightGreen } from '@material-ui/core/colors';

export const theme = createMuiTheme({
   palette: {
      type: 'light',
      primary: {
         main: '##999999',
      },
      secondary: {
         main: '##e6e6e6',
      },
   },
   typography: {
      fontFamily: ['sans-serif'].join(','),
      fontSize: 12,
   },
   spacing: 6,
   overrides: {
      MuiTooltip: {
         tooltipPlacementTop: {
            position: 'relative',
            top: 9,
         },
         tooltipPlacementBottom: {
            position: 'relative',
            top: -9,
         },
      },
   },
   props: {
      MuiPopover: {
         anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
         },
         transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
         },
      },
   },
});

export const getExtraPallet = (theme: Theme) => {
   const isLight = theme.palette.type === 'light';
   return {
      layoutHeader: isLight ? lightGreen[50] : lightGreen[900],
   };
};
