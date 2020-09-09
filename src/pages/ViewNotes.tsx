import _ from 'lodash';
import React, { useEffect, useState, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import Interweave from 'interweave';
import { Card, Dropdown, Menu } from 'antd';
import Delta from 'quill-delta';
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';

import NoteEditor from '@/components/NoteEditor';
import { queryCurrent } from '@/services/user';
import { deleteNote } from '@/services/notes';
import { getGoogleBook } from '@/services/books';


type NoteMenuProps = {
  id: number,
  deleteNote: Function,
}
const NoteMenu: React.ReactNode = (props: NoteMenuProps) => (
  <Menu style={{ 'backgroundColor': '#fafafa' }}>
    <Menu.Item danger onClick={() => props.deleteNote(props.id)}>
      Delete Note
    </Menu.Item>
  </Menu>
)

const interweaveLiStyleOverrides = {
  'listStyleType': 'disc',
  'display': 'list-item',
}
function transform(node: HTMLElement, children: Node[]): React.ReactNode {
  if (node.tagName === 'LI') {
    return <li style={interweaveLiStyleOverrides}>{children} </li> ;
  }
}

type NoteCardProps = {
  noteId: number,
  content: string,
  bookId: number,
  deleteNote: Function,
}
const NoteCard: React.FC<NoteCardProps> = (props) => {

  const [noteContents, setNoteContents] = useState(JSON.parse(props.content).ops)
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (): void => setShowModal(!showModal)

  const updateNoteContents = (__: string, ___: Delta, ____, editor) => {
    console.log(editor.getContents())
    setNoteContents(editor.getContents())
  };

  const cfg = {}
  const converter = new QuillDeltaToHtmlConverter(noteContents, cfg)
  const html = converter.convert()

  return (<>
    <Card
      key={props.noteId}
      style={{ 'maxWidth': '75%', 'marginBottom': '25px' }}
      actions={[
        <EditOutlined key="edit" onClick={() => toggleModal()}/>,
        <Dropdown
          placement="topCenter"
          arrow
          overlay={<NoteMenu id={props.noteId} deleteNote={props.deleteNote} />}
        >
          <EllipsisOutlined key="ellipsis" />
        </Dropdown>,
      ]}
    >
      <Interweave key={props.noteId} content={html} transform={transform} />
    </Card>
    {showModal && <NoteEditor
      noteId={props.noteId}
      toggleModal={toggleModal}
      open={showModal}
      noteContents={noteContents}
      updateNoteContents={updateNoteContents}
    />}
    </>
  )
}


const ViewNotes: React.FC<{}> = () => {

  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [books, setBooks] = useState([]);
  console.log(tags)
  console.log(books)

  async function asyncDeleteNote(id: number) {
    await deleteNote(id)
    const newNotes = notes.filter(note => note.id !== id)
    setNotes(newNotes)
  }

  useEffect(() => {
    async function fetchData() {
      const currentUser = await queryCurrent()
      setNotes(currentUser.notes)
      setTags(currentUser.tags)
      await currentUser.books.map(async (book) => {
        const newBook = await getGoogleBook(book.id)
        newBook['wellReadId'] = book.id
        setBooks(prev => [...prev, newBook])
      })
    }
    fetchData();
  }, []);

  return (
    <PageContainer>
      {notes.map(note => {
        return (<NoteCard
          key={note.id}
          noteId={note.id}
          content={note.content}
          bookId={note.book_id}
          deleteNote={asyncDeleteNote}
        />)
      })}
    </PageContainer>
  )
};

export default ViewNotes;