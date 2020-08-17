import React, { useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { thunkStatus } from 'aNotion/types/thunkStatus';
import { AppPromiseDispatch } from 'aNotion/providers/reduxStore';
import { contentSelector } from 'aNotion/providers/storeSelectors';
import { contentActions } from 'aNotion/components/content/contentSlice';
import { LoadingSection } from '../common/Loading';
import { ErrorFallback, ErrorBoundary } from 'aCommon/Components/ErrorFallback';

const BlockUi = React.lazy(() => import('../blocks/BlockUi'));

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
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Suspense fallback={<LoadingSection />}>
            {status === thunkStatus.fulfilled && (
               <React.Fragment>
                  {content.map((p, i) => (
                     <BlockUi key={p.blockId} block={p} index={i}></BlockUi>
                  ))}
               </React.Fragment>
            )}
            {status === thunkStatus.pending && <LoadingSection />}
         </Suspense>
      </ErrorBoundary>
   );
};
