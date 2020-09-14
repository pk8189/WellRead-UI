import React, { useState } from 'react';
import _ from 'lodash';
import { Button, Card, message } from 'antd';
import { useModel } from 'umi';
import Delta from 'quill-delta';
import { PageContainer } from '@ant-design/pro-layout';

import QuillNotes from '@/components/QuillNotes';
import { addNote, AddNoteParams } from '@/services/notes';
import SaveNote from '@/components/SaveNote';


import './Notes.less';
import 'react-quill/dist/quill.snow.css';

const handleAddNote = async (values: AddNoteParams) => {
  try {
    const res = await addNote({ ...values });
    if (_.get(res, 'id', false)) {
      message.success('Note saved!');
      return
    }
  } catch (error) {
    message.error('Failed to add note');
  }
};

const Note: React.FC<{}> = () => {
  const { initialState } = useModel('@@initialState');
  const { books, tags } = initialState || {};

  const [noteContents, setNoteContents] = useState(new Delta());
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (): void => setShowModal(!showModal)


  const updateNoteContents = (__: string, ___: Delta, ____, editor) => {
    setNoteContents(editor.getContents())
  };
  
  return (
    <PageContainer>
      <Card title="Compose A Note">
        <QuillNotes noteContents={noteContents} updateNoteContents={updateNoteContents}/>
          
        <Button style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>Save</Button>
      </Card>
      {showModal && <SaveNote
        noteContents={noteContents}
        handleSaveNote={handleAddNote}
        toggleModal={toggleModal}
        open={showModal}
        books={books}
        tags={tags}
        selectedTags={[]}
    />}
    </PageContainer>
  );
}


export default Note;
