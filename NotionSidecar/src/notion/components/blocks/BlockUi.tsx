import React, { useEffect } from 'react';
import {
   Typography,
   Divider,
   makeStyles,
   createStyles,
   Theme,
   Link,
   Icon,
} from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { BlockTypes } from 'aNotion/types/notionV3/BlockTypes';
import { Variant } from '@material-ui/core/styles/createTypography';
import {
   grey,
   brown,
   purple,
   deepOrange,
   yellow,
   teal,
   blue,
   pink,
   red,
} from '@material-ui/core/colors';
import { PageUi } from './PageUi';
import { BulletUi } from './BulletUi';
import { TodoUi } from './TodoUi';
import { QuoteUi } from './QuoteUi';
import { CalloutUi } from './CalloutUi';
import { CodeUi } from './CodeUi';
import { ToggleUi } from './ToggleUi';
import { NumberUi } from './NumberUi';
import { BaseTextBlock } from 'aNotion/types/notionV3/typings/basic_blocks';
import {
   SemanticString,
   SemanticFormat,
   StringFormats,
} from 'aNotion/types/notionV3/semanticStringTypes';
import { NotionColor } from 'aNotion/types/notionV3/notionBaseTypes';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
   blockSelector,
   navigationSelector,
} from 'aNotion/providers/storeSelectors';
import { getColor, getBackgroundColor } from 'aNotion/services/blockService';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { blockActions } from './blockSlice';
import { getPageUrl } from 'aNotion/services/notionSiteService';
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined';

export const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      block: {
         margin: 6,
         padding: 3,
      },
      typography: {
         overflowWrap: 'break-word',
      },
      inlineIcon: {
         position: 'relative',
         top: theme.spacing(),
         width: theme.typography.caption.fontSize,
         height: theme.typography.caption.fontSize,
      },
   })
);

export const BlockUi = ({
   block,
   index,
}: {
   block: NotionBlockModel;
   index: number;
}) => {
   let classes = useStyles();
   let variant = useVariant(block);
   let backgroundColor = getBackgroundColor(block);

   return (
      <div
         className={classes.block}
         style={{ backgroundColor: backgroundColor }}>
         {variant != null && block.type !== BlockTypes.Text && (
            <Typography className={classes.typography} variant={variant}>
               {block.simpleTitle}
            </Typography>
         )}
         {block.type === BlockTypes.Text && <TextUi block={block}></TextUi>}
         {block.type === BlockTypes.Divider && <Divider></Divider>}
         {block.type === BlockTypes.Callout && (
            <CalloutUi block={block}></CalloutUi>
         )}
         {block.type === BlockTypes.Quote && <QuoteUi block={block} />}
         {block.type === BlockTypes.ButtetedList && <BulletUi block={block} />}
         {block.type === BlockTypes.NumberedList && <NumberUi block={block} />}
         {block.type === BlockTypes.ToDo && <TodoUi block={block} />}
         {block.type === BlockTypes.Page && <PageUi block={block} />}
         {block.type === BlockTypes.Toggle && <ToggleUi block={block} />}
         {block.type === BlockTypes.Code && <CodeUi block={block} />}
      </div>
   );
};

const TextUi = ({ block }: { block: NotionBlockModel }) => {
   let classes = useStyles();

   let bb = block.block as BaseTextBlock;
   let title = bb.properties?.title;

   if (title != null) {
      return (
         <React.Fragment>
            {title.map((segment, i) => {
               return <TextSegment key={i} segment={segment}></TextSegment>;
            })}
         </React.Fragment>
      );
   }
   return null;
};

const TextSegment = ({ segment }: { segment: SemanticString }) => {
   let classes = useStyles();
   let text = segment[0];
   let format = segment[1] ?? [];
   const dispatch: AppPromiseDispatch<any> = useDispatch();

   const blockData = useSelector(blockSelector);
   let { textStyle, textDetails, textType } = useSegmentData(format);
   let link: string | undefined = undefined;

   useEffect(() => {
      if (textDetails != null && textType === StringFormats.Page) {
         dispatch(blockActions.fetchBlock({ blockId: textDetails }));
      }
   }, [dispatch, textDetails, textType]);

   if (textDetails != null && textType === StringFormats.Page) {
      text = blockData[textDetails]?.block?.simpleTitle ?? '';
      link = getPageUrl(textDetails);
   } else if (textDetails != null && textType === StringFormats.Link) {
      link = textDetails;
   } else if (textDetails != null && textType === StringFormats.User) {
      text = '';
   }

   return (
      <React.Fragment>
         {link == null && (
            <Typography
               display="inline"
               className={classes.typography}
               variant={'body1'}
               style={textStyle}>
               {text}
            </Typography>
         )}
         {link != null && textType === StringFormats.Page && (
            <Link
               display="inline"
               className={classes.typography}
               variant={'body1'}
               href={link}
               target="_blank"
               style={{ ...textStyle }}>
               <Icon fontSize="small" className={classes.inlineIcon}>
                  <OpenInNewOutlinedIcon />
               </Icon>
               {text}
            </Link>
         )}
         {link != null && textType === StringFormats.Link && (
            <Link
               display="inline"
               className={classes.typography}
               variant={'body1'}
               href={link}
               target="_blank"
               style={{ ...textStyle, textDecoration: 'underline' }}>
               {text}
            </Link>
         )}
      </React.Fragment>
   );
};

function useSegmentData(
   format: SemanticFormat[]
): {
   textStyle: React.CSSProperties;
   textDetails: string | undefined;
   textType: string | undefined;
} {
   let textStyle: React.CSSProperties = {};
   let textDetails: string | undefined = undefined;
   let textType: StringFormats | undefined = undefined;

   format.forEach((d) => {
      switch (d[0]) {
         case StringFormats.Bold:
            textStyle.fontWeight = 'bold';
            break;
         case StringFormats.Italic:
            textStyle.fontStyle = 'italic';
            break;
         case StringFormats.Colored:
            if (d[1] != null && getColor(d[1]) != null) {
               if (d[1].includes('background')) {
                  textStyle.backgroundColor = getColor(d[1]);
               } else {
                  textStyle.color = getColor(d[1]);
               }
            }
            break;
         case StringFormats.Strike:
            textStyle.textDecoration = 'line-through';
            break;
         case StringFormats.User:
            if (d[1] != null) {
               textDetails = d[1];
               textType = d[0];
            }
            break;
         case StringFormats.Link:
            if (d[1] != null) {
               textDetails = d[1];
               textType = d[0];
            }
            break;
         case StringFormats.Page:
            textStyle.color = grey[800];
            textStyle.fontWeight = 'bold';
            if (d[1] != null) {
               textDetails = d[1];
               textType = d[0];
            }
            break;
         case StringFormats.InlineCode:
            textStyle.fontFamily = 'Consolas';
            textStyle.background = grey[300];
            textStyle.color = red[700];
            break;
      }
   });

   return { textStyle: { ...textStyle }, textType, textDetails };
}

function useVariant(block: NotionBlockModel) {
   let variant: Variant | undefined;
   switch (block.type) {
      case BlockTypes.Text:
      case BlockTypes.Date:
      case BlockTypes.Bookmark:
         variant = 'body1';
         break;
      case BlockTypes.Header1:
      case BlockTypes.CollectionViewPage:
         variant = 'h4';
         break;
      case BlockTypes.Header2:
         variant = 'h5';
         break;
      case BlockTypes.Header3:
         variant = 'h6';
         break;
   }
   return variant;
}
