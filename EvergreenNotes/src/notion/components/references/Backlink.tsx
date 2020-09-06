import React, { MouseEvent, useState } from 'react';
import { Breadcrumbs, Typography, Grid } from '@material-ui/core';
import { ExpandMoreSharp } from '@material-ui/icons';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { Content } from '../contents/Content';
import { ReferenceActions } from 'aNotion/components/references/ReferenceActions';

import BlockUi from 'aNotion/components/blocks/BlockUi';
import {
   useReferenceStyles,
   Accordion,
   AccordionSummary,
   AccordionActions,
   AccordionDetails,
} from './AccordionStyles';
import { BacklinkRecordModel } from './referenceState';
import { Path } from './Path';

export const Backlink = ({ backlink }: { backlink: BacklinkRecordModel }) => {
   let classes = useReferenceStyles();
   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreSharp />}>
               <Grid container spacing={1}>
                  <Grid item xs={12}>
                     <Typography variant="body1" className={classes.typography}>
                        {getTitle(backlink.backlinkBlock.simpleTitle)}
                     </Typography>
                  </Grid>
                  <Grid item xs>
                     <Path path={backlink.path}></Path>
                  </Grid>
               </Grid>
            </AccordionSummary>
            <AccordionActions>
               <ReferenceActions
                  id={backlink.backlinkBlock.blockId}
                  path={backlink.path}
                  text={backlink.backlinkBlock.simpleTitle}></ReferenceActions>
            </AccordionActions>
            <AccordionDetails>
               <Grid container spacing={1}>
                  <Grid item xs={12} className={classes.reference}>
                     <BlockUi
                        block={backlink.backlinkBlock}
                        index={undefined}></BlockUi>
                  </Grid>
                  <Grid item xs={12}>
                     <div style={{ paddingLeft: 12 }}>
                        <Content
                           blockId={backlink.backlinkBlock.blockId}
                           contentIds={
                              backlink.backlinkBlock.contentIds
                           }></Content>
                     </div>
                  </Grid>
               </Grid>
            </AccordionDetails>
         </Accordion>
      </ErrorBoundary>
   );
};

const getTitle = (title: string, size: number = 100) => {
   if (title.length > size) return title.substring(0, size) + '... ';
   else return title;
};
