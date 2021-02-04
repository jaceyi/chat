import * as React from 'react';
import * as Immutable from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

export const blockRenderMap = DefaultDraftBlockRenderMap.merge(
  Immutable.Map({})
);
