import React, { useEffect } from 'react';
import { useSelector, shallowEqual, connect } from 'react-redux';

import { cookieSelector } from 'aNotion/redux/rootReducer';

// comment
export const UnlinkedReferences = ({ status, data }: any) => {
   const state = useSelector(cookieSelector, shallowEqual);
   return (
      <div style={{ width: 100, height: 100 }}>
         {'lets do this' + state.status + state.data?.token}
      </div>
   );
};

// const mapStateToProps = (state: any, oldProps: any) => {
//    let s = cookieSelector(state);
//    return {
//       status: s.status,
//       data: s.data,
//    };
// };
// const mapDispatchToProps = {};
// export default connect(mapStateToProps)(UnlinkedReferences);
