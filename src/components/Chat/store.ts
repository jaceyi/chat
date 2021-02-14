export default {
  editor: null,

  focusBlockKey: null,

  initial(editor) {
    this.editor = editor;
  },

  getEditorState() {
    return this.editor.props.editorState;
  },

  setEditorState(editorState) {
    return this.editor.props.onChange(editorState);
  }
};
