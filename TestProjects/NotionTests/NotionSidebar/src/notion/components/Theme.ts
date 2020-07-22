import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

export const theme = createMuiTheme({
   palette: {
      primary: {
         main: '#fafafa',
      },
      secondary: {
         main: '#e0e0e0',
      },
   },
   typography: {
      fontFamily: ['sans-serif'].join(','),
      fontSize: 12,
   },
   spacing: 6,
});
