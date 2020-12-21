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
import { LightTooltip } from 'aNotion/components/common/TooltipStyles';

import HelpOutlineTwoToneIcon from '@material-ui/icons/HelpOutlineTwoTone';
import BookmarksTwoToneIcon from '@material-ui/icons/BookmarksTwoTone';
import { LoadingLine } from '../common/Loading';
import {
   blockSelector,
   contentSelector,
} from 'aNotion/providers/storeSelectors';
import { useSelector } from 'react-redux';
import BlockUi from '../blocks/BlockUi';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { PageUi } from '../blocks/PageUi';

export const PageMention = ({
   mentionBlock,
}: {
   mentionBlock: INotionBlockModel;
}) => {
   let classes = useReferenceStyles();
   const blocks = useSelector(blockSelector);
   const [mentionIds, setMentionIds] = useState<string[]>();
   const [showColoredBlocksOnly, setShowColoredBlocksOnly] = useState(false);

   const semanticFilter:
      | SemanticFormatEnum[]
      | undefined = showColoredBlocksOnly
      ? [SemanticFormatEnum.Colored]
      : undefined;

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
                     markupFocusState={showColoredBlocksOnly}
                     handleMarkupFocus={() =>
                        setShowColoredBlocksOnly((h) => !h)
                     }
                     mentionSourceId={mentionBlock.blockId}></ReferenceActions>
               )}
            </AccordionActions>
            <AccordionDetails>
               <Grid container spacing={1}>
                  <Grid item xs className={classes.reference}>
                     <NotionContentWithBlocks
                        blockContent={mentionBlock}></NotionContentWithBlocks>
                  </Grid>
                  <Grid item>
                     <LightTooltip
                        title="This is the block that contains the page mention"
                        placement="top">
                        <HelpOutlineTwoToneIcon
                           className={classes.informationIcon}
                        />
                     </LightTooltip>
                  </Grid>

                  {mentionIds != null && mentionIds?.length > 0 && (
                     <>
                        <Grid item xs={12} className={classes.reference}>
                           <Divider />
                        </Grid>
                        <Grid item xs={12} className={classes.reference}>
                           {mentionIds?.map((m, i) => (
                              <Suspense fallback={LoadingLine} key={i}>
                                 {blocks?.[m]?.status ===
                                    thunkStatus.fulfilled &&
                                    blocks?.[m]?.block != null && (
                                       <PageUi
                                          key={i}
                                          block={blocks?.[m]?.block!}
                                          inlineBlock={false}
                                          semanticFilter={semanticFilter}
                                          showContent={true}></PageUi>
                                    )}
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
