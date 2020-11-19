import React, { MouseEvent, useEffect, useState } from 'react';
import { Breadcrumbs, Typography, Grid } from '@material-ui/core';
import { ExpandMoreSharp } from '@material-ui/icons';
import {
   NotionBlockModel,
   NotionBlockRecord,
} from 'aNotion/models/NotionBlock';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { NotionContentWithParentId } from 'aNotion/components/contents/NotionContent';
import { ReferenceActions } from 'aNotion/components/references/ReferenceActions';

import {
   useReferenceStyles,
   Accordion,
   AccordionSummary,
   AccordionActions,
   AccordionDetails,
} from './AccordionStyles';
import { TextUi } from '../blocks/TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';
import { getValuesForSemanticType } from 'aNotion/services/pageService';

export const PageMention = ({
   mentionBlock,
}: {
   mentionBlock: NotionBlockModel;
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
            <AccordionActions></AccordionActions>
            <AccordionDetails>
               <Grid container spacing={1}>
                  <Grid item xs={12} className={classes.reference}>
                     {mentionIds?.map((m) => (
                        <NotionContentWithParentId
                           key={m}
                           renderPagesAsInline={false}
                           parentBlockId={m}></NotionContentWithParentId>
                     ))}
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
