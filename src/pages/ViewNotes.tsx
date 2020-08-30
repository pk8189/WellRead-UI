import _ from 'lodash';
import React, { useEffect, useState, } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import Interweave from 'interweave';
import { Card } from 'antd';


import { queryCurrent } from '@/services/user';


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
}
const NoteCard: React.FC<{}> = (props: NoteCardProps) => {
  const deltaOps = JSON.parse(props.content).ops
  const cfg = {}
  const converter = new QuillDeltaToHtmlConverter(deltaOps, cfg)
  const html = converter.convert()
  return (
    <Card key={props.id}>
      <Interweave key={props.id} content={html} transform={transform} />
    </Card>
  )

}


const ViewNotes: React.FC<{}> = () => {

  const [notes, setNotes] = useState([]);

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
        return <NoteCard key={note.id} id={note.id} content={note.content} bookId={note.book_id} />
      })}
    </PageContainer>
  )
};

export default ViewNotes;