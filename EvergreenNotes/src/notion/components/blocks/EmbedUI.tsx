import React from 'react';
import { Grid, Link, Typography } from '@material-ui/core';
import { blockStyles } from './blockStyles';
import { IBaseTextUiParams, TextUi } from './TextUi';
import { IBaseSourceBlock as IBaseEmbedBlock } from 'aNotion/types/notionV3/definitions/basic_blocks';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';

export const EmbedUi = ({
   block,
   semanticFilter,
   style,
   interactive,
}: IBaseTextUiParams) => {
   let embed = block.block as IBaseEmbedBlock;
   let classes = blockStyles();

   const source = embed?.properties?.source?.[0]?.[0] ?? undefined;
   const title = embed?.properties?.title?.[0]?.[0] ?? undefined;

   if (embed.type !== BlockTypeEnum.Audio) {
      return (
         <>
            {source != null && (
               <Grid id="EmbedUi" container>
                  <Grid item xs={12}>
                     <Link variant="subtitle1" target="_blank" href={source}>
                        {title ?? source}
                     </Link>
                  </Grid>
               </Grid>
            )}
         </>
      );
   } else {
      return (
         <>
            {source != null && (
               <Grid id="EmbedUi" container>
                  <Grid item xs={12}></Grid>
               </Grid>
            )}
         </>
      );
   }
};
