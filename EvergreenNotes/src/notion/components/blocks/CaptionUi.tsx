import React, { useMemo } from 'react';
import { TextSegment } from './TextSegment';
import { Segment } from 'aNotion/types/notionV3/semanticStringTypes';

interface ICaptionUiParams {
   captions: Segment[];
}
export const CaptionUi = ({ captions }: ICaptionUiParams) => {
   const c = useMemo(
      () =>
         captions.map((s, i) => (
            <TextSegment
               key={i}
               segment={s}
               variant="caption"
               incrementSegmentCount={() => {}}
               interactive={false}></TextSegment>
         )),
      [captions]
   );

   if (captions != null && captions.length > 0) {
      return <>{c}</>;
   }

   return null;
};
