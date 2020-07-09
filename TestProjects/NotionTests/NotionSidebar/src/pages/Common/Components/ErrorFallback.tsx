import React from 'react';
import {
   Grid,
   Button,
   Typography,
   IconButton,
   Tooltip,
   Avatar,
} from '@material-ui/core';
import {
   ExpansionPanel,
   ExpansionPanelSummary,
   ExpansionPanelDetails,
} from '@material-ui/core';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({ error, componentStack }: FallbackProps) => {
   // TODO in future, change this so that it takes dev or production into account when rendering
   //https://github.com/bvaughn/react-error-boundary

   let { msg, showDetails, msgDetails } = componentMessages(error);
   consoleLog(error, componentStack);

   return (
      <React.Fragment>
         {!showDetails && <Typography>{msg}</Typography>}
         {showDetails && (
            <ExpansionPanel>
               <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                     <IconButton color="secondary">
                        <ErrorOutlineIcon></ErrorOutlineIcon>
                     </IconButton>
                     {msg}
                  </Typography>
               </ExpansionPanelSummary>
               <ExpansionPanelDetails>
                  <Typography variant="caption">
                     <pre style={{ fontFamily: 'inherit' }}>{msgDetails}</pre>
                  </Typography>
               </ExpansionPanelDetails>
            </ExpansionPanel>
         )}
      </React.Fragment>
   );
};
export { ErrorBoundary };

function componentMessages(error: any) {
   const IsDev = true;

   let msg = '';
   let showDetails = true;
   //    if (name == null || name == '') msg = 'A react component had an error';
   //    else msg = `The ${name} component had an error`;
   let msgDetails = error.stack.slice(0, 400);
   msgDetails += '\n\r...\n\r';
   if (error.stack.length > 600)
      msgDetails += error.stack.slice(
         error.stack.length - 600,
         error.stack.length
      );

   if (!IsDev) {
      msg = 'There was an error.  Please contact support.';
      showDetails = false;
   }

   return { msg, showDetails, msgDetails };
}

function consoleLog(error: any, componentStack: string | undefined) {
   console.log('--------------------');
   console.log(error.stack);
   console.log(componentStack);
   console.log('--------------------');
}
