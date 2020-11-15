import React, { MouseEvent, useState } from 'react';
import { Breadcrumbs, Typography, Grid } from '@material-ui/core';
import { ExpandMoreSharp } from '@material-ui/icons';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { NotionContentWithBlocks } from 'aNotion/components/contents/NotionContent';
import { ReferenceActions } from 'aNotion/components/references/ReferenceActions';

import BlockUi from 'aNotion/components/blocks/BlockUi';
import {
   useReferenceStyles,
   Accordion,
   AccordionSummary,
   AccordionActions,
   AccordionDetails,
} from './AccordionStyles';
import { BacklinkRecordModel } from 'aNotion/components/references/referenceState';
import { Path } from 'aNotion/components/references/Path';
import { TextUi } from '../blocks/TextUi';

export const Backlink = ({ backlink }: { backlink: BacklinkRecordModel }) => {
   let classes = useReferenceStyles();
   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreSharp />}>
               <Grid container spacing={1} alignItems="flex-start">
                  <Grid item xs>
                     <Path path={backlink.path}></Path>
                  </Grid>
                  <Grid item xs={12}>
                     <TextUi
                        block={backlink.backlinkBlock}
                        interactive={false}></TextUi>
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
                     <NotionContentWithBlocks
                        blockContent={
                           backlink.backlinkBlock
                        }></NotionContentWithBlocks>
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
