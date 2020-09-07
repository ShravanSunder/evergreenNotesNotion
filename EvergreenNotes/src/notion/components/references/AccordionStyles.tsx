import { withStyles, makeStyles, Theme, createStyles } from '@material-ui/core';
import {
   Accordion as MuiAccordion,
   AccordionSummary as MuiAccordionSummary,
   AccordionDetails as MuiAccordionDetails,
   AccordionActions as MuiAccordionActions,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const Accordion = withStyles({
   root: {
      border: '1px solid rgba(0, 0, 0, .33)',
      boxShadow: 'none',

      marginTop: '12px',
      marginBottom: '12px',
      '&:before': {
         display: 'none',
      },
      '&$expanded': {
         margin: 'auto',
         marginTop: '36px',
         marginBottom: '36px',
      },
   },
   expanded: {},
})(MuiAccordion);

export const AccordionSummary = withStyles((theme) => ({
   root: {
      backgroundColor: grey[100],
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 42,
      '&$expanded': {
         minHeight: 51,
      },
   },
   content: {
      '&$expanded': {
         margin: '12px 0',
      },
   },
   expanded: {},
}))(MuiAccordionSummary);

export const AccordionDetails = withStyles((theme) => ({
   root: {
      padding: theme.spacing(2),
   },
}))(MuiAccordionDetails);

export const AccordionActions = withStyles((theme) => ({
   root: {
      padding: theme.spacing(2),
      boxShadow: '0px 1px 6px #f5f5f5',
      backgroundColor: grey[50],
   },
}))(MuiAccordionActions);

export const useReferenceStyles = makeStyles((theme: Theme) =>
   createStyles({
      typography: {
         overflowWrap: 'anywhere',
         textAlign: 'left',
      },
      button: {
         fontSize: '0.65rem',
         color: grey[700],
         borderColor: grey[700],
      },
      reference: {
         paddingBottom: theme.spacing(1),
         marginLeft: -theme.spacing(1),
      },
   })
);
