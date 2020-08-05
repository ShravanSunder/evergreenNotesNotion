import React from 'react';
import {
   Typography,
   Divider,
   makeStyles,
   createStyles,
   Theme,
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
   StringFormat,
} from 'aNotion/types/notionV3/semanticStringTypes';
import { NotionColor } from 'aNotion/types/notionV3/notionBaseTypes';

export const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      block: {
         margin: 6,
         padding: 3,
      },
      typography: {
         overflowWrap: 'break-word',
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
   let backgroundColor = useBackgroundColor(block);

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

   let textStyle: React.CSSProperties = {};
   let hasLink = false;
   let isUserMention = false;
   let isPageMention = false;
   format.forEach((d) => {
      switch (d[0]) {
         case StringFormat.Bold:
            textStyle.fontWeight = 'bold';
            break;
         case StringFormat.Italic:
            textStyle.fontStyle = 'italic';
            break;
         case StringFormat.Colored:
            if (d[1] != null && getColor(d[1]) != null) {
               textStyle.color = getColor(d[1]);
            }
            break;
         case StringFormat.Strike:
            textStyle.textDecoration = 'line-through';
            break;
         case StringFormat.User:
            isUserMention = true;
            break;
         case StringFormat.Page:
            textStyle.color = grey[700];
            textStyle.fontWeight = 'bold';
            isPageMention = true;
            break;
         case StringFormat.InlineCode:
            textStyle.fontFamily = 'Consolas';
            textStyle.background = grey[200];
            textStyle.color = red[500];
            break;
      }
   });

   return (
      <Typography
         display="inline"
         className={classes.typography}
         variant={'body1'}
         style={textStyle}>
         {text}
      </Typography>
   );
};

const getColor = (bgColor: string) => {
   if (bgColor != null) {
      switch (bgColor) {
         case NotionColor.GreyBg:
         case NotionColor.Grey:
            return grey[200];
         case NotionColor.Brown:
            return brown[100];
         case NotionColor.Orange:
            return deepOrange[50];
         case NotionColor.Yellow:
            return yellow[50];
         case NotionColor.Teal:
            return teal[50];
         case NotionColor.Blue:
            return blue[50];
         case NotionColor.Purple:
            return purple[50];
         case NotionColor.Pink:
            return pink[50];
         case NotionColor.Red:
            return red[50];
      }
   }

   //transparent
   return undefined;
};

const useBackgroundColor = (block: NotionBlockModel) => {
   let bgColor = block.block?.format?.block_color;
   if (block.type === BlockTypes.Code) {
      bgColor = NotionColor.GreyBg;
   }

   if (bgColor != null) {
      switch (bgColor) {
         case NotionColor.GreyBg:
            return grey[200];
         case NotionColor.BrownBg:
            return brown[100];
         case NotionColor.OrangeBg:
            return deepOrange[50];
         case NotionColor.YellowBg:
            return yellow[50];
         case NotionColor.TealBg:
            return teal[50];
         case NotionColor.BlueBg:
            return blue[50];
         case NotionColor.PurpleBg:
            return purple[50];
         case NotionColor.PinkBg:
            return pink[50];
         case NotionColor.RedBg:
            return red[50];
      }
   }

   //transparent
   return '#FFFFFF';
};

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
