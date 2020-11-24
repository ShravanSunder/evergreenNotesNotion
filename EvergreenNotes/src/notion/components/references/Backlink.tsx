import React, { MouseEvent, useEffect, useState } from 'react';
import { Breadcrumbs, Typography, Grid, Divider } from '@material-ui/core';
import { ExpandMoreSharp } from '@material-ui/icons';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import {
   NotionContentWithBlocks,
   NotionContentWithParentId,
} from 'aNotion/components/contents/NotionContent';
import { ReferenceActions } from 'aNotion/components/references/ReferenceActions';

import BlockUi from 'aNotion/components/blocks/BlockUi';
import {
   Accordion,
   AccordionSummary,
   AccordionActions,
   AccordionDetails,
} from './AccordionStyles';
import { useReferenceStyles } from './referenceStyles';
import { BacklinkRecordModel } from 'aNotion/components/references/referenceState';
import { Path } from 'aNotion/components/references/Path';
import { TextUi } from '../blocks/TextUi';
import { PageUi } from '../blocks/PageUi';

import BookmarksTwoToneIcon from '@material-ui/icons/BookmarksTwoTone';
import { grey } from '@material-ui/core/colors';
import { LightTooltip } from '../common/Styles';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';

interface IBacklinkProps {
   backlink: BacklinkRecordModel;
   showInlineBlock?: boolean;
}

export const Backlink = ({
   backlink,
   showInlineBlock = true,
}: IBacklinkProps) => {
   let classes = useReferenceStyles();
   const [backlinkedPageBlock, setBacklinkedPageBlock] = useState<
      INotionBlockModel | undefined
   >();

   useEffect(() => {
      if (backlink.path.length > 0) {
         if (backlink.backlinkBlock.type == BlockTypeEnum.Page) {
            setBacklinkedPageBlock(backlink.backlinkBlock);
         } else {
            const index = backlink.path
               .map(
                  (p) =>
                     p.type === BlockTypeEnum.Page ||
                     p.type === BlockTypeEnum.CollectionViewPage
               )
               .lastIndexOf(true);
            setBacklinkedPageBlock(backlink.path[index]);
         }
      }
   }, [backlink.path, backlink.backlinkBlock.blockId]);

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
                  text={backlink.backlinkBlock.simpleTitle}
                  mentionSourceId={
                     backlink.backlinkBlock.blockId
                  }></ReferenceActions>
            </AccordionActions>
            <AccordionDetails>
               <Grid container spacing={1}>
                  {showInlineBlock && (
                     <>
                        <Grid item>
                           <LightTooltip title="Backlink block" placement="top">
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
                        </Grid>
                        <Grid item xs={11} className={classes.reference}>
                           <NotionContentWithBlocks
                              blockContent={
                                 backlink.backlinkBlock
                              }></NotionContentWithBlocks>
                        </Grid>
                     </>
                  )}

                  {backlinkedPageBlock != null && (
                     <>
                        {!showInlineBlock && (
                           <Grid item xs={12} className={classes.reference}>
                              <Divider />
                           </Grid>
                        )}
                        <Grid
                           item
                           xs={12}
                           className={classes.reference}
                           style={{ marginTop: 12 }}>
                           <PageUi
                              block={backlinkedPageBlock}
                              inlineBlock={false}
                              showContent={true}></PageUi>
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
