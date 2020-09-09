import React, { useEffect, useState, } from 'react';
import _ from 'lodash';
import { Button, Card, message } from 'antd';
import Delta from 'quill-delta';
import { PageContainer } from '@ant-design/pro-layout';

import QuillNotes from '@/components/QuillNotes';
import { getGoogleBook } from '@/services/books';
import { queryCurrent } from '@/services/user';
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
    message.error('Failed to add book');
  }
};

const Note: React.FC<{}> = () => {
  const [noteContents, setNoteContents] = useState(new Delta());
  const [showModal, setShowModal] = useState(false);
  const [googleBooks, setGoogleBooks] = useState([]);
  const [tags, setTags] = useState([]);

  const toggleModal = (): void => setShowModal(!showModal)

  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await queryCurrent()
        setTags(currentUser.tags)
        await currentUser.books.map(async (book) => {
          const newBook = await getGoogleBook(book.id)
          newBook['wellReadId'] = book.id
          setGoogleBooks(prev => [...prev, newBook])
        })
      } catch {
        console.log('error')
      }
    }
    fetchData();
  }, []);

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
        books={googleBooks}
        tags={tags}
        selectedTags={[]}
    />}
    </PageContainer>
  );
}


export default Note;
