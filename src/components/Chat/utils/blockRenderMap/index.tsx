import * as React from 'react';
import * as Immutable from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';
import BrRow from './components/BrRow';

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(
  Immutable.Map({
    'br-row': {
      element: 'div',
      wrapper: <BrRow />,
      editable: false
    }
  })
);
