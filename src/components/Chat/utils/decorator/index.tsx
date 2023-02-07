import * as React from 'react';
import { CompositeDecorator } from 'draft-js';
import { Mutability } from 'chatUtils/types';
import { AttachUtils } from 'chatUtils';
import Link, { LinkEntityType, LinkMutability } from './components/Link';
import Emoji, { EmojiEntityType, EmojiMutability } from './components/Emoji';
import SuggestionUser, { SuggestionUserReg } from './components/SuggestionUser';
import User, { UserEntityType, UserMutability } from './components/User';
import Code, { CodeReg } from './components/Code';

const findEntities = (type: string, mutability: Mutability) => {
  return (contentBlock: any, callback: Function, contentState: any) => {
    contentBlock.findEntityRanges((character: any) => {
      const entityKey = character.getEntity();

      if (entityKey !== null) {
        const entity = contentState.getEntity(entityKey);
        return (
          entity.getType() === type && entity.getMutability() === mutability
        );
      }
    }, callback);
  };
};

export const getDecorator = (editor?: any) => {
  const connectStoreToProps = (Component: any) => (props: object) =>
    <Component {...props} store={editor} />;

  return new CompositeDecorator([
    {
      strategy: findEntities(LinkEntityType, LinkMutability),
      component: Link
    },
    {
      strategy: findEntities(EmojiEntityType, EmojiMutability),
      component: Emoji
    },
    {
      strategy: (contentBlock: any, callback: Function) => {
        AttachUtils.findWithRegex(SuggestionUserReg, contentBlock, callback);
      },
      component: connectStoreToProps(SuggestionUser)
    },
    {
      strategy: findEntities(UserEntityType, UserMutability),
      component: User
    },
    {
      strategy: (contentBlock: any, callback: Function) => {
        AttachUtils.findWithRegex(CodeReg, contentBlock, callback);
      },
      component: Code
    }
  ]);
};
