import React, { MouseEvent, useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { ExpandMoreSharp } from '@material-ui/icons';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { NotionContentWithBlocks } from 'aNotion/components/contents/NotionContent';
import { ReferenceActions } from 'aNotion/components/references/ReferenceActions';

import {
   useReferenceStyles,
   Accordion,
   AccordionSummary,
   AccordionActions,
   AccordionDetails,
} from './AccordionStyles';
import { SearchRecordModel } from 'aNotion/models/SearchRecord';
import { Path } from './Path';

export const Reference = ({ refData }: { refData: SearchRecordModel }) => {
   let classes = useReferenceStyles();
   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreSharp />}>
               <Grid container spacing={2}>
                  <Grid item xs>
                     <Path path={refData.path}></Path>
                  </Grid>
                  <Grid item xs={12}>
                     <Typography variant="body1" className={classes.typography}>
                        {parse(refData.textByContext)}
                     </Typography>
                  </Grid>
               </Grid>
            </AccordionSummary>
            <AccordionActions>
               <ReferenceActions
                  id={refData.id}
                  path={refData.path}
                  text={refData.text}></ReferenceActions>
            </AccordionActions>
            <AccordionDetails>
               <div className={classes.reference}>
                  <NotionContentWithBlocks
                     renderPagesAsInline={false}
                     blockContent={
                        refData.notionBlock
                     }></NotionContentWithBlocks>
               </div>
            </AccordionDetails>
         </Accordion>
      </ErrorBoundary>
   );
};

const parse = (textByContext: string[]) => {
   return (
      <React.Fragment>
         {textByContext.map((f, i) => {
            if (i % 2 === 1) {
               return <strong key={i}>{f}</strong>;
            } else {
               return (
                  <React.Fragment key={i}>{getTitle(f, 120)}</React.Fragment>
               );
            }
         })}
      </React.Fragment>
   );
};

export const getTitle = (title: string, size: number = 100) => {
   if (title.length > size) return title.substring(0, size) + '... ';
   else return title;
};
