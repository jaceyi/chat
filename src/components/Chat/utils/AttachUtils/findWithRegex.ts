export const findWithRegex = (regex: RegExp, contentBlock, callback): void => {
  const contentBlockText = contentBlock.getText();

  contentBlock.findEntityRanges(
    character => {
      return !character.getEntity();
    },
    (nonEntityStart, nonEntityEnd) => {
      const text = contentBlockText.slice(nonEntityStart, nonEntityEnd);
      let matchArr;
      let start;
      let prevLastIndex = regex.lastIndex;
      while ((matchArr = regex.exec(text)) !== null) {
        if (regex.lastIndex === prevLastIndex) {
          break;
        }
        prevLastIndex = regex.lastIndex;
        start = nonEntityStart + matchArr.index;
        callback(start, start + matchArr[0].length);
      }
    }
  );
};
