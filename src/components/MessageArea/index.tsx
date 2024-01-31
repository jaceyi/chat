import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import type { FC } from 'react';
import Message, { MessageInfo } from './Message';
import * as styles from './style.module.scss';
import Loading from './Loading';
import { AutoSizer, List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

export type MessageList = MessageInfo[];

interface MessageAreaProps {
  messageList: MessageList;
  loading: boolean;
}

const MessageArea: FC<MessageAreaProps> = ({ messageList, loading }) => {
  const timer = useRef(0);
  const [scrollToIndex, setScrollToIndex] = useState(-1);
  useEffect(() => {
    setScrollToIndex(messageList.length - 1);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setScrollToIndex(-1);
    }, 100);
  }, [messageList]);

  const cacheRef = useRef(
    new CellMeasurerCache({
      defaultHeight: 10,
      fixedWidth: true
    })
  );

  return (
    <div className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <AutoSizer>
          {({ width, height }) => (
            <List
              height={height}
              width={width}
              rowCount={messageList.length}
              rowHeight={cacheRef.current.rowHeight}
              deferredMeasurementCache={cacheRef.current}
              scrollToIndex={scrollToIndex}
              rowRenderer={({ key, index, parent, style }) => {
                const message = messageList[index];
                return (
                  <CellMeasurer key={key} cache={cacheRef.current} parent={parent} rowIndex={index}>
                    {({ measure, registerChild }) => (
                      <div style={style} ref={node => node && registerChild?.(node)}>
                        <Message {...message} onResize={measure} />
                      </div>
                    )}
                  </CellMeasurer>
                );
              }}
            />
          )}
        </AutoSizer>
      )}
    </div>
  );
};

export default React.memo(MessageArea);
