import React from 'react';
import { Breadcrumbs, Typography } from '@material-ui/core';
import { INotionBlockModel } from 'aNotion/models/NotionBlock';
import { getTitle } from 'aNotion/components/references/Reference';

export const Path = ({ path }: { path: INotionBlockModel[] }) => {
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
