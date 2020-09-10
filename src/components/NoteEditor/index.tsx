import _ from 'lodash';
import React, { useState }  from 'react';
import { Modal, Button } from 'antd';
import Delta from 'quill-delta';

import QuillNotes from '@/components/QuillNotes';

type NoteEditorProps = {
  noteId: number,
  toggleModal: Function,
  open: boolean,
  noteContents: Delta,
  saveUpdateNote, Function,
}
const NoteEditor: React.FC<NoteEditorProps> = (props: NoteEditorProps) => {
  const [noteContents, setNoteContents] = useState(props.noteContents)
  const saveNoteParams = { content: JSON.stringify(noteContents) }
  const deltaProps = new Delta(noteContents)

  const updateNoteContents = (__: string, ___: Delta, ____, editor) => {
    setNoteContents(editor.getContents())
  };

  const saveIt = async (saveParams: Object, noteId: number) => {
    await props.saveUpdateNote(saveParams, noteId)
    props.toggleModal()
  }

  return (
    <Modal
      title="Edit Note"
      visible={props.open}
      onOk={() => props.toggleModal()}
      onCancel={() => props.toggleModal()}
      footer={[
        <Button key="cancel" onClick={() => props.toggleModal()}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={() => saveIt(saveNoteParams, props.noteId)}>
          Save
        </Button>,
      ]}
    >
      <QuillNotes noteContents={deltaProps} updateNoteContents={updateNoteContents} />
    </Modal>

  )
}

export default NoteEditor;