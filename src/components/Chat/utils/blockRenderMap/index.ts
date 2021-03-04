import * as Immutable from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(
  Immutable.Map({
    unstyled: {
      element: 'div',
      aliasedElements: ['p']
    }
  })
);
