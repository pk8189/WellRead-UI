import _ from 'lodash';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import Interweave from 'interweave';
import { Card, Dropdown, Menu, message } from 'antd';
import { useModel } from 'umi';
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';

import NoteEditor from '@/components/NoteEditor';
import { deleteNote } from '@/services/notes';
import { updateNote } from '@/services/notes';


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
  saveUpdateNote: Function,
}
const NoteCard: React.FC<NoteCardProps> = (props) => {

  const noteContents = JSON.parse(props.content).ops
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (): void => setShowModal(!showModal)

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
      saveUpdateNote={props.saveUpdateNote}
    />}
    </>
  )
}


const ViewNotes: React.FC<{}> = () => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const { notes } = initialState || {};

  async function asyncDeleteNote(id: number) {
    await deleteNote(id)
    const newNotes = notes.filter(note => note.id !== id)
    setInitialState({ ...initialState, notes: newNotes })
  }

  async function saveUpdateNote(saveParams: Object, noteId: number) {
    const updatedNote = await updateNote(saveParams, noteId)
    if (_.get(updatedNote, 'id', false)) {
      const noteIdx = notes.findIndex((note => note.id == noteId));
      notes[noteIdx].content = saveParams.content
      setInitialState({...initialState, notes: notes})
      message.success('Note updated!');
      return
    }
    message.error('Failed to save note')
    return
  }

  return (
    <PageContainer>
      {notes.map(note => {
        return (<NoteCard
          key={note.id}
          noteId={note.id}
          content={note.content}
          bookId={note.book_id}
          deleteNote={asyncDeleteNote}
          saveUpdateNote={saveUpdateNote}
        />)
      })}
    </PageContainer>
  )
};

export default ViewNotes;