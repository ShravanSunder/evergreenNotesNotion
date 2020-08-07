import React from 'react';
import { Typography, Icon } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { Page } from 'aNotion/types/notionV3/notionBlockTypes';
import { useBlockStyles } from './BlockUi';
import { LinkOutlined } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
import { TextUi } from './TextUi';

export const PageUi = ({ block }: { block: NotionBlockModel }) => {
   return (
      <React.Fragment>
         <TextUi block={block}></TextUi>
      </React.Fragment>
   );
};
