import { createMuiTheme, Theme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { grey, lightGreen } from '@material-ui/core/colors';

// declare module '@material-ui/core/styles/createMuiTheme' {
//    interface Theme {
//       status: {
//          danger: React.CSSProperties['color'];
//       };
//    }
//    interface ThemeOptions {
//       status: {
//          danger: React.CSSProperties['color'];
//       };
//    }
// }

declare module '@material-ui/core/styles/createPalette' {
   interface Palette {
      layoutBackground: Palette['primary'];
      layoutAccent: Palette['primary'];
      reference: Palette['primary'];
      referenceBorder: Palette['primary'];
   }
   interface PaletteOptions {
      layoutBackground: PaletteOptions['primary'];
      layoutAccent: PaletteOptions['primary'];
      reference: PaletteOptions['primary'];
      referenceBorder: PaletteOptions['primary'];
   }
}

export const createAppTheme = (isDark: boolean): Theme => {
   return createMuiTheme({
      palette: {
         type: 'light',
         primary: {
            main: grey[500],
         },
         layoutBackground: {
            main: lightGreen[100],
         },
         layoutAccent: {
            main: lightGreen[800],
         },
         reference: {
            main: grey[100],
         },
         referenceBorder: {
            main: 'rgba(0, 0, 0, 0.125)',
         },
         tonalOffset: 0.2,
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
};
