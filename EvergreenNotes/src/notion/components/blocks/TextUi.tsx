import React, { useEffect } from 'react';
import { Typography, Link, Icon, SvgIcon } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { grey, red } from '@material-ui/core/colors';
import { IBaseTextBlock } from 'aNotion/types/notionV3/definitions/basic_blocks';
import {
   SemanticString,
   SemanticFormat,
   SemanticFormatEnum,
   AbsoluteDateTime,
   RelativeDateTime,
} from 'aNotion/types/notionV3/semanticStringTypes';
import { useSelector, useDispatch } from 'react-redux';
import {
   blockSelector,
   mentionSelector,
} from 'aNotion/providers/storeSelectors';
import { getColor, parseDate } from 'aNotion/services/blockService';
import { TAppDispatchWithPromise } from 'aNotion/providers/appDispatch';
import { blockActions } from 'aNotion/components/blocks/blockSlice';
import { getPageUrl, getSiteUrl } from 'aNotion/services/notionSiteService';
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined';
import { useBlockStyles } from './useBlockStyles';
import { Variant } from '@material-ui/core/styles/createTypography';
import { MentionsState } from '../mentions/mentionsState';
import { RecordState } from './blockState';
import { CantDisplayThisType, SomethingWentWrong } from '../common/Loading';
import { BlockTypeEnum } from 'aNotion/types/notionV3/BlockTypes';
import { Block } from '@material-ui/icons';

export interface IBaseTextUiParams {
   block: INotionBlockModel;
   style?: React.CSSProperties;
   semanticFilter?: SemanticFormatEnum[];
   interactive?: boolean;
}

export interface ITextUiParams extends IBaseTextUiParams {
   variant?: Variant;
}

interface ISegmentParams {
   segment: SemanticString;
   style?: React.CSSProperties;
   semanticFilter?: SemanticFormatEnum[];
   variant?: Variant;
   interactive: boolean;
}

export const TextUi = ({
   block,
   variant,
   interactive,
   style,
   semanticFilter,
}: ITextUiParams) => {
   let classes = useBlockStyles();
   let title: SemanticString[] | undefined = (block.block as IBaseTextBlock)
      ?.properties?.title as SemanticString[];
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

   if (title != null) {
      //if not interactive also truncate the max segment size
      let textCount = 0;
      const maxLen = 150;

      return (
         <React.Fragment>
            {title.map((segment, i) => {
               if (
                  interactive === false &&
                  textCount < maxLen &&
                  textCount + segment[0].length > maxLen
               ) {
                  //catch errors
                  console.log('render error');
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
                     style={{ ...style }}></TextSegment>
               );
            })}
         </React.Fragment>
      );
   }

   return null;
};

export interface ISegmentMeta {
   segmentStyle: React.CSSProperties;
   segmentDetails: string | undefined;
   segmentType: string | undefined;
   hideSegment: boolean;
}

const TextSegment = ({
   segment,
   variant,
   interactive,
   style,
   semanticFilter,
}: ISegmentParams) => {
   let classes = useBlockStyles();
   let text = segment[0];
   let format = segment[1] ?? [];
   const dispatch: TAppDispatchWithPromise<any> = useDispatch();

   const blockData = useSelector(blockSelector);
   const mentionData = useSelector(mentionSelector);
   let {
      segmentStyle,
      segmentDetails,
      segmentType,
      hideSegment,
   }: ISegmentMeta = useSegmentData(format, style, semanticFilter);

   useEffect(() => {
      if (segmentDetails != null && segmentType === SemanticFormatEnum.Page) {
         dispatch(blockActions.fetchBlock({ blockId: segmentDetails }));
      }
   }, [dispatch, segmentDetails, segmentType]);

   let link: string | undefined;
   ({ link, text } = formatSegment(
      segmentDetails,
      segmentType,
      text,
      blockData,
      mentionData
   ));

   //nothing to render
   if (text == null || (text.trim().length === 0 && segmentDetails == null)) {
      return null;
   }

   //hide the text
   if (hideSegment) {
      return (
         <div style={{ paddingTop: 3 }}>
            <Typography> {'  '} </Typography>
         </div>
      );
   }

   return (
      <React.Fragment>
         {link == null && (
            <Typography
               id="TextUI"
               display="inline"
               className={classes.typography}
               variant={variant}
               style={{ ...segmentStyle }}>
               {text}
            </Typography>
         )}
         {link != null && segmentType === SemanticFormatEnum.Page && (
            <Link
               id="TextUI"
               display="inline"
               className={classes.typography}
               variant={variant}
               href={interactive ? link : undefined}
               target="_blank"
               style={{ ...segmentStyle }}>
               <SvgIcon
                  fontSize="inherit"
                  className={classes.inlineIcon}
                  viewBox="0 0 48 48">
                  <OpenInNewOutlinedIcon />
               </SvgIcon>{' '}
               {text}
            </Link>
         )}
         {link != null && segmentType === SemanticFormatEnum.Link && (
            <>
               <Link
                  id="TextUI"
                  display="inline"
                  className={classes.link}
                  variant={variant}
                  href={interactive ? link : undefined}
                  target="_blank"
                  style={{ ...segmentStyle, textDecoration: 'underline' }}>
                  {text}
               </Link>
            </>
         )}
      </React.Fragment>
   );
};
const useSegmentData = (
   format: SemanticFormat[],
   style?: React.CSSProperties,
   semanticFilter?: SemanticFormatEnum[]
): ISegmentMeta => {
   let segmentStyle: React.CSSProperties = { ...style } ?? {};
   let segmentDetails: string | undefined = undefined;
   let segmentType: SemanticFormatEnum | undefined = undefined;
   let hideSegment: boolean =
      semanticFilter?.length === 0 || semanticFilter == null ? false : true;

   if (hideSegment) {
      if (
         style?.backgroundColor != null &&
         style?.backgroundColor !== '#FFFFFF' &&
         semanticFilter?.find((f) => f === SemanticFormatEnum.Colored)
      ) {
         hideSegment = false;
      }
   }

   format.forEach((d) => {
      if (hideSegment && semanticFilter?.includes(d[0])) {
         hideSegment = false;
      }

      switch (d[0]) {
         case SemanticFormatEnum.Bold:
            segmentStyle.fontWeight = 'bold';
            break;
         case SemanticFormatEnum.Italic:
            segmentStyle.fontStyle = 'italic';
            break;
         case SemanticFormatEnum.Colored:
            if (d[1] != null && getColor(d[1]) != null) {
               if (d[1].includes('background')) {
                  segmentStyle.backgroundColor = getColor(d[1]);
               } else {
                  segmentStyle.color = getColor(d[1]);
               }
            }
            break;
         case SemanticFormatEnum.Strike:
            segmentStyle.textDecoration = 'line-through';
            break;
         case SemanticFormatEnum.User:
            if (d[1] != null) {
               segmentDetails = d[1];
               segmentType = d[0];
            }
            if (segmentStyle.color == null) {
               segmentStyle.color = grey[700];
            }
            break;
         case SemanticFormatEnum.Link:
            if (d[1] != null) {
               segmentDetails = d[1];
               segmentType = d[0];
            }
            if (segmentStyle.color == null) {
               segmentStyle.color = grey[800];
            }
            break;
         case SemanticFormatEnum.Page:
            segmentStyle.color = grey[700];
            segmentStyle.fontWeight = 'bold';
            if (d[1] != null) {
               segmentDetails = d[1];
               segmentType = d[0];
            }
            break;
         case SemanticFormatEnum.InlineCode:
            segmentStyle.fontFamily = 'Consolas';
            if (segmentStyle.backgroundColor == null) {
               segmentStyle.background = grey[300];
            }
            if (segmentStyle.color == null) {
               segmentStyle.color = red[700];
            }
            break;
         case SemanticFormatEnum.DateTime:
            if (d[1] != null) {
               let dateData = d[1] as any;
               segmentDetails = parseDate(dateData);
               segmentType = d[0];
            }
            if (segmentStyle.color == null) {
               segmentStyle.color = grey[700];
            }
      }
   });

   return {
      segmentStyle: { ...segmentStyle },
      segmentType: segmentType,
      segmentDetails: segmentDetails,
      hideSegment: hideSegment,
   };
};

const formatSegment = (
   segmentDetails: string | undefined,
   segmentType: string | undefined,
   text: string,
   blockData: RecordState,
   mentionData: MentionsState
) => {
   let link: string | undefined = undefined;
   if (segmentDetails != null && segmentType === SemanticFormatEnum.Page) {
      text = blockData[segmentDetails]?.block?.simpleTitle ?? '';
      if (text.length === 0) {
         text == 'Untitled';
      }
      link = getPageUrl(segmentDetails);
   } else if (
      segmentDetails != null &&
      segmentType === SemanticFormatEnum.Link
   ) {
      link = getSiteUrl() + segmentDetails.replace(/-/g, '').replace('/', '');
   } else if (
      segmentDetails != null &&
      segmentType === SemanticFormatEnum.User &&
      mentionData.users[segmentDetails] != null
   ) {
      text =
         ' @' +
         mentionData.users[segmentDetails]?.user?.given_name +
         ', ' +
         mentionData.users[segmentDetails]?.user?.family_name +
         ' ';
   } else if (segmentType === SemanticFormatEnum.DateTime) {
      text = segmentDetails ?? '';
   }
   return { link, text };
};
