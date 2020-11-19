import React, { MouseEvent, useEffect, useState } from 'react';
import { Breadcrumbs, Typography, Grid, Divider } from '@material-ui/core';
import { ExpandMoreSharp } from '@material-ui/icons';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import {
   NotionContentWithBlocks,
   NotionContentWithParentId,
} from 'aNotion/components/contents/NotionContent';
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
import { PageUi } from '../blocks/PageUi';
import { getValuesForSemanticType } from 'aNotion/services/pageService';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { isGuid } from 'aCommon/extensionHelpers';

export const Backlink = ({ backlink }: { backlink: BacklinkRecordModel }) => {
   let classes = useReferenceStyles();

   let backlinkedPageBlock: NotionBlockModel | undefined = undefined;
   if (backlink.path.length > 0) {
      backlinkedPageBlock = backlink.path[0];
   }

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

                  {backlinkedPageBlock != null && (
                     <>
                        <Grid item xs={12} className={classes.reference}>
                           <Divider />
                        </Grid>
                        <Grid
                           item
                           xs={12}
                           className={classes.reference}
                           style={{ marginTop: 12 }}>
                           <PageUi
                              block={backlinkedPageBlock}
                              inlineBlock={false}></PageUi>
                        </Grid>
                     </>
                  )}
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
