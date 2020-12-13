import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const useReferenceStyles = makeStyles((theme: Theme) =>
   createStyles({
      typography: {
         overflowWrap: 'anywhere',
         textAlign: 'left',
      },
      actionButton: {
         fontSize: '0.65rem',
         color: theme.palette.referenceAccent.main,
         borderColor: theme.palette.referenceAccent.light,
         maxHeight: 21,
      },
      reference: {
         padding: theme.spacing(1),
      },
      actionButtonIcon: {
         maxHeight: 18,
         maxWidth: 18,
      },
   })
);
