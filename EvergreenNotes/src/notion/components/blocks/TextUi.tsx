import React, { useEffect, useState } from 'react';
import { Typography, Icon } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { IBaseTextBlock } from 'aNotion/types/notionV3/definitions/basic_blocks';
import {
   Segment,
   SemanticFormatEnum,
   AbsoluteDateTime,
   RelativeDateTime,
} from 'aNotion/types/notionV3/semanticStringTypes';
import { blockStyles } from './blockStyles';
import { Variant } from '@material-ui/core/styles/createTypography';
import { CantDisplayThisType } from '../common/Loading';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { TextSegment } from './TextSegment';

export interface IBaseTextUiParams {
   block: INotionBlockModel;
   style?: React.CSSProperties;
   semanticFilter?: SemanticFormatEnum[];
   interactive?: boolean;
   setHasSegments?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ITextUiParams extends IBaseTextUiParams {
   variant?: Variant;
}

export const TextUi = ({
   block,
   variant,
   interactive,
   style,
   semanticFilter,
   setHasSegments,
}: ITextUiParams) => {
   let classes = blockStyles();

   let title: Segment[] | undefined = (block.block as IBaseTextBlock)
      ?.properties?.title as Segment[];
   if (title == null) {
      title = block?.collection?.name;
   }

   if (
      block.type === BlockTypeEnum.TemplateButton ||
      block.type === BlockTypeEnum.TableOfContents ||
      block.type === BlockTypeEnum.Equation ||
      block.type === BlockTypeEnum.File ||
      block.type === BlockTypeEnum.PDF ||
      block.type === BlockTypeEnum.Unknown ||
      block.type === BlockTypeEnum.Video ||
      block.type === BlockTypeEnum.Audio
   ) {
      return <CantDisplayThisType />;
   }

   let segmentTally = { count: 0 };
   const incrementSegmentCount = () => {
      segmentTally.count = segmentTally.count + 1;
   };

   let textUi: (JSX.Element | null)[] | null = null;

   if (title != null) {
      //if not interactive also truncate the max segment size
      let textCount = 0;
      const maxLen = 150;

      textUi = title.map((segment, i) => {
         if (
            interactive === false &&
            textCount < maxLen &&
            textCount + segment[0].length > maxLen
         ) {
            //catch errors
            console.log('render error');
            incrementSegmentCount();
            return (
               <Typography
                  key={i}
                  display="inline"
                  className={classes.typography}
                  variant={variant ?? 'body1'}>
                  {'...'}
               </Typography>
            );
         }
         textCount += segment[0].length;
         if (interactive === false && textCount > maxLen) {
            //catch errors
            return null;
         }

         return (
            <TextSegment
               key={i}
               segment={segment}
               variant={variant ?? 'body1'}
               interactive={interactive ?? true}
               semanticFilter={semanticFilter}
               incrementSegmentCount={incrementSegmentCount}
               style={{ ...style }}></TextSegment>
         );
      });
   }

   useEffect(() => {
      if (setHasSegments != null) {
         setHasSegments(segmentTally.count > 0);
      }
   });

   return <>{textUi}</>;
};
