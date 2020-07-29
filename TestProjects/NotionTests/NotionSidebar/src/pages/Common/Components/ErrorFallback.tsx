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
   Accordion,
   AccordionSummary,
   AccordionDetails,
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
            <Accordion>
               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">
                     <IconButton color="secondary">
                        <ErrorOutlineIcon></ErrorOutlineIcon>
                     </IconButton>
                     {msg}
                  </Typography>
               </AccordionSummary>
               <AccordionDetails>
                  <Typography variant="caption">
                     <pre style={{ fontFamily: 'inherit' }}>{msgDetails}</pre>
                  </Typography>
               </AccordionDetails>
            </Accordion>
         )}
      </React.Fragment>
   );
};
export { ErrorBoundary };

function componentMessages(error: any) {
   let msg = 'Uhoh! There was an error!';
   let showDetails = true; // dev flag needed //todo

   let msgDetails = error.stack.slice(0, 400);
   msgDetails += '\n\r...\n\r';
   if (error.stack.length > 600)
      msgDetails += error.stack.slice(
         error.stack.length - 600,
         error.stack.length
      );

   return { msg, showDetails, msgDetails };
}

function consoleLog(error: any, componentStack: string | undefined) {
   console.log('--------------------');
   console.log(error.stack);
   console.log(componentStack);
   console.log('--------------------');
}
