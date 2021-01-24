export default {
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
