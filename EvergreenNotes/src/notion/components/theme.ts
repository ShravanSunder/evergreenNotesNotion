import { createMuiTheme, Theme } from '@material-ui/core/styles';
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
      layoutBackground: Palette['primary'];
      layoutAccent: Palette['primary'];
      referenceBackground: Palette['primary'];
      referenceAccent: Palette['primary'];
      referenceBorder: Palette['primary'];
      notionColors: INotionColors;
   }
   interface PaletteOptions {
      layoutBackground: PaletteOptions['primary'];
      layoutAccent: PaletteOptions['primary'];
      referenceBackground: PaletteOptions['primary'];
      referenceAccent: PaletteOptions['primary'];
      referenceBorder: PaletteOptions['primary'];
      notionColors: INotionColors;
   }
}

export const createAppTheme = (isDark: boolean): Theme => {
   isDark = true;
   const notionBackground: string = isDark ? '#2f3437' : '#ffffff';
   const notionSecondaryDark: string = '#373c3f';

   const appPalette = {
      layoutBackground: {
         main: isDark ? '#373c3f' : lightGreen[100],
      },
      layoutAccent: {
         main: isDark ? lightGreen[500] : lightGreen[800],
         light: isDark ? lightGreen[400] : lightGreen[700],
         dark: isDark ? lightGreen[700] : lightGreen[900],
      },
      referenceBackground: {
         main: isDark ? notionSecondaryDark : grey[100],
      },
      referenceAccent: {
         main: isDark ? grey[200] : grey[800],
         light: isDark ? grey[100] : grey[700],
         dark: isDark ? grey[300] : grey[900],
      },
      referenceBorder: {
         main: isDark ? notionSecondaryDark : 'rgba(0, 0, 0, 0.125)',
      },
      notionColors: {
         inlineCode: isDark ? red[300] : red[700],
         mentions: isDark ? grey[300] : grey[700],
      },
   };

   return createMuiTheme({
      palette: {
         type: 'dark',
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
};
