import { makeStyles, createStyles, Theme } from '@material-ui/core';

export const blockStyles = makeStyles((theme: Theme) =>
   createStyles({
      block: {
         marginRight: theme.spacing(0.5),
         marginLeft: theme.spacing(0.5),
         marginTop: theme.spacing(1),
         marginBottom: theme.spacing(1),
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
         paddingLeft: theme.spacing(1),
         paddingRight: theme.spacing(1),
         marginRight: 1,
         marginTop: 1,
         float: 'right',
      },
      numbers: {
         paddingLeft: 4,
         paddingRight: theme.spacing(1),
         marginRight: 1,
         float: 'right',
      },
      todo: {
         paddingLeft: 2,
         paddingRight: theme.spacing(1),
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
      embed: {
         padding: theme.spacing(1),
         borderWidth: theme.spacing(0.5),
         borderColor: theme.palette.layoutBackground.main,
         //backgroundColor: theme.palette.layoutBackground.main,
         cursor: 'pointer',
         margin: 0,
         marginTop: theme.spacing(0.5),
         marginBottom: theme.spacing(0.5),
      },
   })
);
