import { makeStyles, Theme, createStyles } from '@material-ui/core';

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
      informationIcon: {
         maxHeight: 15,
         maxWidth: 15,
         margin: 0,
         marginTop: 11,
         color: theme.palette.primary.main,
      },
   })
);
