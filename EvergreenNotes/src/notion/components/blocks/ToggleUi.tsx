import React, { useState } from 'react';
import { Typography, Grid, IconButton } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Toggle } from 'aNotion/types/notionV3/notionBlockTypes';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import { NotionContent } from '../contents/NotionContent';
import { useBlockStyles } from './BlockUi';
import { BaseTextUiParameters, TextUi } from './TextUi';
import { SemanticFormatEnum } from 'aNotion/types/notionV3/semanticStringTypes';

export const ToggleUi = ({
   block,
   semanticFilter,
   style,
}: BaseTextUiParameters) => {
   let classes = useBlockStyles();
   let toggle = block.block as Toggle;

   const [expanded, setExpanded] = useState(false);
   const handleClick = (e: React.SyntheticEvent) => {
      e.stopPropagation();
      setExpanded(!expanded);
   };

   let filteredSemanticFilter: SemanticFormatEnum[] = [];
   if (style?.backgroundColor !== '#ffffff' && style?.backgroundColor != null) {
      filteredSemanticFilter =
         semanticFilter?.filter((f) => f !== SemanticFormatEnum.Colored) ?? [];
   } else if (semanticFilter != null) {
      filteredSemanticFilter = [...semanticFilter];
   }

   return (
      <Grid container>
         <Grid item xs={1} style={{ paddingLeft: 3 }}>
            <IconButton size="small" onClick={handleClick}>
               {expanded && <ArrowDropDown fontSize="inherit" />}
               {!expanded && <ArrowRight fontSize="inherit" />}
            </IconButton>
         </Grid>
         <Grid item xs={11}>
            <TextUi
               block={block}
               semanticFilter={semanticFilter}
               style={style}
            />
            {expanded && (
               <NotionContent
                  blockId={block.blockId}
                  semanticFilter={filteredSemanticFilter}
                  style={style}></NotionContent>
            )}
         </Grid>
      </Grid>
   );
};
