import _ from 'lodash';
import React, { useEffect, useState, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import Interweave from 'interweave';
import { Card, Dropdown, Menu } from 'antd';
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';

import { queryCurrent } from '@/services/user';
import { deleteNote } from '@/services/notes';

type NoteMenuProps = {
  id: number,
  deleteNote: Function
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
  id: number,
  content: string,
  bookId: number,
  deleteNote: Function,
}
const NoteCard: React.FC<{}> = (props: NoteCardProps) => {
  const deltaOps = JSON.parse(props.content).ops
  const cfg = {}
  const converter = new QuillDeltaToHtmlConverter(deltaOps, cfg)
  const html = converter.convert()
  return (<Card
      key={props.id}
      style={{ 'maxWidth': '75%', 'marginBottom': '25px' }}
      actions={[
        <EditOutlined key="edit" />,
        <Dropdown
          placement="topCenter"
          arrow
          overlay={
            <NoteMenu id={props.id} deleteNote={deleteNote} />
          }
        >
          <EllipsisOutlined key="ellipsis" />
        </Dropdown>,
      ]}
    >
      <Interweave key={props.id} content={html} transform={transform} />
    </Card>
  )

}


const ViewNotes: React.FC<{}> = () => {

  const [notes, setNotes] = useState([]);

  async function asyncDeleteNote(id: number) {
    console.log(id)
    console.log(notes)
    await deleteNote(id)
    const newNotes = notes.filter(note => note.id !== id)
    setNotes(newNotes)
  }

  useEffect(() => {
    async function fetchData() {
      const currentUser = await queryCurrent()
      setNotes(currentUser.notes)
    }
    fetchData();
  }, []);

  return (
    <PageContainer>
      {notes.map(note => {
        return (<NoteCard
          key={note.id}
          id={note.id}
          content={note.content}
          bookId={note.book_id}
          deleteNote={asyncDeleteNote}
        />)
      })}
    </PageContainer>
  )
};

export default ViewNotes;