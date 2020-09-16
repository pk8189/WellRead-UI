import _ from 'lodash';
import React, { useState }  from 'react';
import { Modal, Button } from 'antd';
import Delta from 'quill-delta';

import QuillNotes from '@/components/QuillNotes';

type NoteEditorProps = {
  toggleModal: Function,
  toggleSaveModal: Function,
  open: boolean,
  noteContents: Delta,
  saveUpdateNote, Function,
  newNote?: Boolean,
}
const NoteEditor: React.FC<NoteEditorProps> = (props: NoteEditorProps) => {
  const [noteContents, setNoteContents] = useState(props.noteContents)
  const deltaProps = new Delta(noteContents)

  const updateNoteContents = (__: string, ___: Delta, ____, editor) => {
    setNoteContents(editor.getContents())
  };

  const saveIt = () => {
    props.saveUpdateNote(deltaProps)
    props.toggleModal()
    props.toggleSaveModal()
  }

  return (
    <Modal
      title={props.newNote ? 'New Note' : 'Edit Note'}
      visible={props.open}
      onCancel={() => props.toggleModal()}
      footer={[
        <Button key="cancel" onClick={() => props.toggleModal()}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={() => saveIt()}>
          Continue
        </Button>,
      ]}
    >
      <QuillNotes noteContents={deltaProps} updateNoteContents={updateNoteContents} />
    </Modal>

  )
}

export default NoteEditor;