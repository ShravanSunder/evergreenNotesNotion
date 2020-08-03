import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

export const theme = createMuiTheme({
   palette: {
      primary: {
         main: '#f2f2f2',
      },
      secondary: {
         main: '#9c9c9c',
      },
   },
   typography: {
      fontFamily: ['sans-serif'].join(','),
      fontSize: 12,
   },
   spacing: 6,
});
