import * as React from 'react';
import * as Immutable from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

export const WrapBlockType = 'wrap';

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(
  Immutable.Map({
    wrap: {
      element: 'wrap-line'
    }
  })
);
