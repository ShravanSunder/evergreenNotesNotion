import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const blockStyles = makeStyles((theme: Theme) =>
   createStyles({
      block: {
         marginRight: 3,
         marginLeft: 3,
         marginTop: 6,
         marginBottom: 6,
         padding: 0,
      },
      typography: {
         overflowWrap: 'break-word',
         wordBreak: 'break-word',
         position: 'relative',
         whiteSpace: 'pre-wrap',
      },
      blockUiGrids: {
         margin: 0,
         padding: 0,
      },
      bulletsAndIndents: {
         paddingLeft: 6,
         paddingRight: 6,
         marginRight: 1,
         marginTop: 1,
         float: 'right',
      },
      numbers: {
         paddingLeft: 4,
         paddingRight: 6,
         marginRight: 1,
         float: 'right',
      },
      todo: {
         paddingLeft: 2,
         paddingRight: 6,
         marginRight: 1,
         marginTop: 1,
         float: 'right',
      },
      quote: {
         backgroundColor: theme.palette.referenceAccent.main,
         width: 2,
      },
      toggle: {
         paddingLeft: 0,
         marginLeft: 0,
         paddingRight: 0,
         float: 'right',
      },
      inlineIcon: {
         position: 'relative',
         top: 3,
      },
      link: {
         overflowWrap: 'anywhere',
         wordBreak: 'break-all',
         color: theme.palette.referenceAccent.main,
      },
   })
);
