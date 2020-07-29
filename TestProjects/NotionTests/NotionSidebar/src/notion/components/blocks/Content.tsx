import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { contentSelector } from 'aNotion/providers/storeSelectors';
import { contentActions } from 'aNotion/components/blocks/contentSlice';
import { NotionBlockModel } from 'aNotion/models/NotionBlock';

export const Content = ({ blockId }: { blockId: string }) => {
   const contentData = useSelector(contentSelector);
   const dispatch: AppPromiseDispatch<any> = useDispatch();

   useEffect(() => {
      dispatch(contentActions.fetchContent({ blockId }));
   }, [blockId, dispatch]);

   let content = contentData?.[blockId]?.content;
   let status = contentData?.[blockId]?.status;

   return (
      <React.Fragment>
         {status === thunkStatus.fulfilled && (
            <React.Fragment>
               {content.map((p) => (
                  <Block key={p.blockId} block={p}></Block>
               ))}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};

export const Block = ({ block }: { block: NotionBlockModel }) => {
   return (
      <Typography variant="body2" key={block.blockId}>
         {block.title}
      </Typography>
   );
};
