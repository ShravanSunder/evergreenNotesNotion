import { withStyles } from '@material-ui/core';
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
      borderRadius: 6,
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
      borderRadius: 6,
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: 0,
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
      borderRadius: 6,
      backgroundColor: grey[50],
   },
}))(MuiAccordionActions);
