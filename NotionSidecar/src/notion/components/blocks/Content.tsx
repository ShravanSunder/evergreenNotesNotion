import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { contentSelector } from 'aNotion/providers/storeSelectors';
import { contentActions } from 'aNotion/components/blocks/contentSlice';
import { BlockUi } from './BlockUi';
import { Skeleton } from '@material-ui/lab';

export const Content = ({
   blockId,
   contentIds,
}: {
   blockId: string;
   contentIds?: string[];
}) => {
   const contentData = useSelector(contentSelector);
   const content = contentData?.[blockId]?.content;
   const status = contentData?.[blockId]?.status;
   const dispatch: AppPromiseDispatch<any> = useDispatch();

   useEffect(() => {
      dispatch(
         contentActions.fetchContent({ blockId, contentIds: contentIds ?? [] })
      );
   }, [blockId, contentIds, dispatch]);

   return (
      <React.Fragment>
         {status === thunkStatus.fulfilled && (
            <React.Fragment>
               {content.map((p, i) => (
                  <BlockUi key={p.blockId} block={p} index={i}></BlockUi>
               ))}
            </React.Fragment>
         )}
         {status === thunkStatus.pending && (
            <React.Fragment>
               <Skeleton />
               <Skeleton />
               <Skeleton />
               <Skeleton />
            </React.Fragment>
         )}
      </React.Fragment>
   );
};
