import _ from 'lodash';
import React from 'react';
import { Modal, Button } from 'antd';
import Delta from 'quill-delta';

import { updateNote } from '@/services/notes';
import QuillNotes from '@/components/QuillNotes';

type NoteEditorProps = {
  noteId: number,
  toggleModal: Function,
  open: boolean,
  noteContents: Delta,
  updateNoteContents: Function,
}
const NoteEditor: React.FC<NoteEditorProps> = (props: NoteEditorProps) => {

  const saveNoteParams = { content: JSON.stringify(props.noteContents) }
  const deltaProps = new Delta(props.noteContents)

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
        <Button key="save" type="primary" onClick={() => { updateNote(saveNoteParams, props.noteId); props.toggleModal() }}>
          Save
        </Button>,
      ]}
    >
      <QuillNotes noteContents={deltaProps} updateNoteContents={props.updateNoteContents} />
    </Modal>

  )
}

export default NoteEditor;