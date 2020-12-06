import React, { MouseEvent, Suspense, useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { ExpandMoreSharp } from '@material-ui/icons';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';
import { NotionContentWithBlocks } from 'aNotion/components/contents/NotionContent';
import { ReferenceActions } from 'aNotion/components/references/ReferenceActions';

import {
   Accordion,
   AccordionSummary,
   AccordionActions,
   AccordionDetails,
} from './AccordionStyles';
import { useReferenceStyles } from './referenceStyles';
import { ISearchRecordModel } from 'aNotion/models/SearchRecord';
import { Path } from './Path';
import { LoadingSection } from '../common/Loading';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

export const Reference = ({ refData }: { refData: ISearchRecordModel }) => {
   let classes = useReferenceStyles();
   const [showColoredBlocksOnly, setShowColoredBlocksOnly] = useState(false);

   const semanticFilter:
      | SemanticFormatEnum[]
      | undefined = showColoredBlocksOnly
      ? [SemanticFormatEnum.Colored]
      : undefined;

   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
               <AccordionSummary expandIcon={<ExpandMoreSharp />}>
                  <Grid container spacing={2}>
                     <Grid item xs>
                        <Path path={refData.path}></Path>
                     </Grid>
                     <Grid item xs={12}>
                        <Typography
                           variant="body1"
                           className={classes.typography}>
                           {parse(refData.textByContext)}
                        </Typography>
                     </Grid>
                  </Grid>
               </AccordionSummary>
               <AccordionActions>
                  <ReferenceActions
                     id={refData.id}
                     path={refData.path}
                     text={refData.text}
                     markupFocusState={showColoredBlocksOnly}
                     handleMarkupFocus={() =>
                        setShowColoredBlocksOnly((h) => !h)
                     }></ReferenceActions>
               </AccordionActions>
               <AccordionDetails>
                  <div className={classes.reference}>
                     <NotionContentWithBlocks
                        interactive={true}
                        renderPagesAsInline={false}
                        semanticFilter={semanticFilter}
                        blockContent={
                           refData.notionBlock
                        }></NotionContentWithBlocks>
                  </div>
               </AccordionDetails>
            </Accordion>
         </Suspense>
      </ErrorBoundary>
   );
};

const parse = (textByContext: string[]) => {
   return (
      <React.Fragment>
         {textByContext.map((f, i) => {
            if (i % 2 === 1) {
               return <strong key={f + i}>{f}</strong>;
            } else {
               return (
                  <React.Fragment key={f + i}>
                     {getTitle(f, 120)}
                  </React.Fragment>
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
