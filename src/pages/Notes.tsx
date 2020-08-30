import React, { useEffect, useState, } from 'react';
import _ from 'lodash';
import { Button, Card, Modal, message, Form, Select, Switch } from 'antd';
import ReactQuill from 'react-quill';
import Delta from 'quill-delta';
import { PageContainer } from '@ant-design/pro-layout';

import { getGoogleBook } from '@/services/books';
import { queryCurrent } from '@/services/user';
import { addNote, AddNoteParams } from '@/services/notes';


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


type SaveNoteProps = {
  noteContents: string,
  toggleModal: Function,
  open: boolean,
  books: Array<Object>,
}
const SaveNote: React.FC<{props: SaveNoteProps}> = (props: SaveNoteProps) => {
  const [privateNote, setPrivateNote] = useState(false);
  const [bookId, setBookId] = useState(null)

  const values = { content: JSON.stringify(props.noteContents), book_id: bookId, private: privateNote }

  return (
    <Modal
      title="Save Note"
      visible={props.open}
      onOk={() => props.toggleModal()}
      onCancel={() => props.toggleModal()}
      footer={[
        <Button key="back" onClick={() => props.toggleModal()}>
          Back
        </Button>,
        <Button key="submit" type="primary" disabled={props.noteContents==='' || !bookId}onClick={() => handleAddNote(values) && props.toggleModal() }>
          Save
        </Button>,
      ]}
    >
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      >
        <Form.Item label="Book">
        <Select onSelect={(value) => setBookId(value)}>
          {props.books.map(book => {
            return (<Select.Option
              key={book.id}
              value={book.wellReadId}
            >{book.volumeInfo.title}</Select.Option>)
          })}
        </Select>
        </Form.Item>
        <Form.Item label="Private">
          <Switch checked={privateNote} onChange={() => setPrivateNote(!privateNote)} />
        </Form.Item>
    </Form>
    </Modal>
  )
}

const Note: React.FC<{}> = () => {
  const [noteContents, setNoteContents] = useState(new Delta());
  const [showModal, setShowModal] = useState(false);
  const [googleBooks, setGoogleBooks] = useState([]);

  const toggleModal = (): void => setShowModal(!showModal)


  useEffect(() => {
    async function fetchData() {
      try {
        const currentUser = await queryCurrent()
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'bullet', 'indent',
    'link', 'image'
  ]
  
  return (
    <PageContainer>
      <Card title="Compose A Note">
        <ReactQuill
          name="editor"
          onChange={updateNoteContents}
          value={noteContents}
          placeholder="Note contents"
          modules={modules}
          formats={formats}
          preserveWhitespace
        />
          
        <Button style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>Save</Button>
      </Card>
      {showModal && <SaveNote noteContents={noteContents} toggleModal={toggleModal} open={showModal} books={googleBooks}/>}
    </PageContainer>
  );
}


export default Note;
