import React, { MouseEvent, Suspense, useEffect, useState } from 'react';
import { Breadcrumbs, Typography, Grid, Divider } from '@material-ui/core';
import { ExpandMoreSharp } from '@material-ui/icons';
import {
   INotionBlockModel,
   NotionBlockRecord,
} from 'aNotion/models/NotionBlock';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import {
   NotionContentWithBlocks,
   NotionContentWithParentId,
} from 'aNotion/components/contents/NotionContent';
import { ReferenceActions } from 'aNotion/components/references/ReferenceActions';

import {
   Accordion,
   AccordionSummary,
   AccordionActions,
   AccordionDetails,
} from './AccordionStyles';
import { useReferenceStyles } from './referenceStyles';
import { TextUi } from '../blocks/TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { getValuesForSemanticType } from 'aNotion/services/pageService';
import { LightTooltip } from 'aNotion/components/common/Styles';
import BookmarksTwoToneIcon from '@material-ui/icons/BookmarksTwoTone';
import { grey } from '@material-ui/core/colors';
import { LoadingLine } from '../common/Loading';

export const PageMention = ({
   mentionBlock,
}: {
   mentionBlock: INotionBlockModel;
}) => {
   let classes = useReferenceStyles();
   const [mentionIds, setMentionIds] = useState<string[]>();

   useEffect(() => {
      let pageIds = getValuesForSemanticType(
         mentionBlock.semanticTitle,
         SemanticFormatEnum.Page
      );

      setMentionIds(pageIds);
   }, [mentionBlock.semanticTitle]);

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary expandIcon={<ExpandMoreSharp />}>
               <Grid container spacing={1} justify="flex-start">
                  <Grid item xs={12}>
                     <TextUi block={mentionBlock} interactive={false}></TextUi>
                  </Grid>
               </Grid>
            </AccordionSummary>
            <AccordionActions>
               {mentionIds != null && mentionIds?.length > 0 && (
                  <ReferenceActions
                     id={mentionIds[0]}
                     path={[]}
                     text={undefined}
                     mentionSourceId={mentionBlock.blockId}></ReferenceActions>
               )}
            </AccordionActions>
            <AccordionDetails>
               <Grid container spacing={1}>
                  <LightTooltip title="Page mention block" placement="top">
                     <BookmarksTwoToneIcon
                        style={{
                           maxHeight: 15,
                           maxWidth: 15,
                           margin: 0,
                           marginTop: 11,
                           color: grey[600],
                        }}
                     />
                  </LightTooltip>
                  <Grid item xs={11} className={classes.reference}>
                     <NotionContentWithBlocks
                        blockContent={mentionBlock}></NotionContentWithBlocks>
                  </Grid>
                  {mentionIds != null && mentionIds?.length > 0 && (
                     <>
                        <Grid item xs={12} className={classes.reference}>
                           <Divider />
                        </Grid>
                        <Grid item xs={12} className={classes.reference}>
                           {mentionIds?.map((m, i) => (
                              <Suspense fallback={LoadingLine}>
                                 <NotionContentWithParentId
                                    key={m + i}
                                    renderPagesAsInline={false}
                                    interactive={true}
                                    parentBlockId={
                                       m
                                    }></NotionContentWithParentId>
                              </Suspense>
                           ))}
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
