import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const useBlockStyles = makeStyles((theme: Theme) =>
   createStyles({
      block: {
         margin: 0,
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
      indentFirstColumn: {
         paddingLeft: 0,
         paddingRight: 18,
      },
      indentFirstColumnBullets: {
         paddingLeft: 9,
         paddingRight: 9,
         marginTop: 1,
      },
      indentFirstColumnTodo: {
         paddingLeft: 6,
         paddingRight: 6,
         marginTop: 1,
      },
      indentSecondColumn: {
         paddingLeft: 0,
      },
      inlineIcon: {
         position: 'relative',
         top: 3,
      },
      link: {
         overflowWrap: 'anywhere',
         wordBreak: 'break-all',
         color: grey[600],
      },
   })
);
