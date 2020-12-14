import { withStyles } from '@material-ui/core';
import {
   Accordion as MuiAccordion,
   AccordionSummary as MuiAccordionSummary,
   AccordionDetails as MuiAccordionDetails,
   AccordionActions as MuiAccordionActions,
} from '@material-ui/core';

export const Accordion = withStyles((theme) => ({
   root: {
      border: '1px solid',
      borderColor: theme.palette.referenceBackground.main,
      backgroundColor: theme.palette.referenceBackground.light,
      borderRadius: 6,
      boxShadow: `1px 1px 6px ${theme.palette.referenceBackground.main} -1px 1px 6px ${theme.palette.referenceBackground.main} 1px -1px 6px ${theme.palette.referenceBackground.main} -1px -1px 6px ${theme.palette.referenceBackground.main}`,

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
}))(MuiAccordion);

export const AccordionSummary = withStyles((theme) => ({
   root: {
      backgroundColor: theme.palette.referenceBackground.main,
      borderRadius: 6,
      boxShadow: `1px 1px 6px ${theme.palette.referenceBackground.main} 1px -1px 6px ${theme.palette.referenceBackground.main} -1px 1px 6px ${theme.palette.referenceBackground.main} -1px -1px 6px ${theme.palette.referenceBackground.main}`,
      borderBottomColor: theme.palette.referenceBorder.main,
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
      backgroundColor: theme.palette.referenceBackground.light,
   },
}))(MuiAccordionDetails);

export const AccordionActions = withStyles((theme) => ({
   root: {
      padding: theme.spacing(2),
      boxShadow: `0px 1px 6px ${theme.palette.referenceBackground.main}`,
      borderRadius: 6,
      backgroundColor: theme.palette.referenceBackground.light,
   },
}))(MuiAccordionActions);
