export const findWithRegex = (
  regex: RegExp,
  contentBlock: any,
  callback: Function
): void => {
  const contentBlockText = contentBlock.getText();

  contentBlock.findEntityRanges(
    (character: any) => {
      return !character.getEntity();
    },
    (nonEntityStart: number, nonEntityEnd: number) => {
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
