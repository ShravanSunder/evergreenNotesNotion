import {
   createMuiTheme,
   responsiveFontSizes,
   Theme,
} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { grey, lightGreen, red } from '@material-ui/core/colors';

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
   interface INotionColors {
      inlineCode: string;
      mentions: string;
   }

   interface Palette {
      fabBackground: Palette['primary'];
      layoutBackground: Palette['primary'];
      layoutAccent: Palette['primary'];
      referenceBackground: Palette['primary'];
      referenceAccent: Palette['primary'];
      referenceBorder: Palette['primary'];
      notionColors: INotionColors;
   }
   interface PaletteOptions {
      fabBackground: PaletteOptions['primary'];
      layoutBackground: PaletteOptions['primary'];
      layoutAccent: PaletteOptions['primary'];
      referenceBackground: PaletteOptions['primary'];
      referenceAccent: PaletteOptions['primary'];
      referenceBorder: PaletteOptions['primary'];
      notionColors: INotionColors;
   }
}

export const createAppTheme = (isDark: boolean): Theme => {
   const notionBackground: string = isDark ? '#2f3437' : '#ffffff';
   const notionSecondaryDark: string = '#373c3f';

   const appPalette = {
      fabBackground: {
         main: isDark ? '#505558' : lightGreen[50],
      },
      layoutBackground: {
         main: isDark ? '#373c3f' : '#f7f6f3',
      },
      layoutAccent: {
         light: isDark ? lightGreen[300] : lightGreen[700],
         main: isDark ? lightGreen[500] : lightGreen[800],
         dark: isDark ? lightGreen[700] : lightGreen[900],
      },
      referenceBackground: {
         main: isDark ? notionSecondaryDark : grey[100],
      },
      referenceAccent: {
         light: isDark ? grey[100] : grey[700],
         main: isDark ? grey[200] : grey[800],
         dark: isDark ? grey[400] : grey[900],
      },
      referenceBorder: {
         main: isDark ? notionSecondaryDark : 'rgba(0, 0, 0, 0.125)',
      },
      notionColors: {
         inlineCode: isDark ? red[300] : red[700],
         mentions: isDark ? grey[300] : grey[700],
      },
   };

   let theme = createMuiTheme({
      palette: {
         type: isDark ? 'dark' : 'light',
         primary: {
            main: isDark ? grey[100] : grey[500],
         },
         ...appPalette,
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
         MuiPaper: {
            root: {
               backgroundColor: notionBackground,
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
   return responsiveFontSizes(theme);
};
