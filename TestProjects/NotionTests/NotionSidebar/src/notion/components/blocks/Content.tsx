import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { contentSelector } from 'aNotion/providers/storeSelectors';
import { contentActions } from 'aNotion/components/blocks/contentSlice';
import { BlockUi } from './BlockUi';

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
                  <BlockUi key={p.blockId} block={p}></BlockUi>
               ))}
            </React.Fragment>
         )}
      </React.Fragment>
   );
};
