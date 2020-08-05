import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

export const theme = createMuiTheme({
   palette: {
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
});
