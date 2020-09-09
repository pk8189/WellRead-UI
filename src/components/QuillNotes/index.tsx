import React from 'react';
import ReactQuill from 'react-quill';
import Delta from 'quill-delta';

import './QuillNotes.less';
import 'react-quill/dist/quill.snow.css';

type QuillNotesProps = {
  noteContents: Delta,
  updateNoteContents: Function,
}
const QuillNotes: React.FC<QuillNotesProps> = (props) => {

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'bullet'}],
      ['link', 'image'],
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ]

  return (
    <ReactQuill
      name="editor"
      onChange={props.updateNoteContents}
      value={props.noteContents}
      placeholder="Note contents"
      modules={modules}
      formats={formats}
      preserveWhitespace
    />
  );
}

export default QuillNotes;