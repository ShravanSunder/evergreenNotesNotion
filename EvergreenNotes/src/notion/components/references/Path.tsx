import React from 'react';
import { Breadcrumbs, Typography } from '@material-ui/core';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';
import { getTitle } from './Reference';

export const Path = ({ path }: { path: NotionBlockModel[] }) => {
   return (
      <Breadcrumbs maxItems={4}>
         {path.map((p) => (
            <Typography variant="caption" key={p.blockId}>
               {getTitle(p.simpleTitle)}
            </Typography>
         ))}
      </Breadcrumbs>
   );
};
