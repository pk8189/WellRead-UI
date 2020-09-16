import _ from 'lodash';
import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import Interweave from 'interweave';
import { Card, Dropdown, Menu, message, Avatar, Divider, Tag, Select } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';

import { useModel } from 'umi';
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';

import NoteEditor from '@/components/NoteEditor';
import SaveNote from '@/components/SaveNote';
import { deleteNote, updateNote, tagNote, removeTagNote, addNote, AddNoteParams } from '@/services/notes';

import './Notes.less';
import Delta from 'quill-delta';

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
  book: Object,
  private: boolean,
  books: Array<Object>,
  tags: Array<Object>,
  allTags: Array<Object>,
  deleteNote: Function,
  saveUpdateNote: Function,
}
const NoteCard: React.FC<NoteCardProps> = (props) => {

  const [noteContents, setNoteContents] = useState(JSON.parse(props.content).ops)
  const [showEditorModal, setShowModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const toggleEditorModal = (): void => setShowModal(!showEditorModal)
  const toggleSaveModal = (): void => setShowSaveModal(!showSaveModal)

  const saveNoteContents = (nC: Array<Object>): void => setNoteContents(nC.ops)

  const cfg = {}
  const converter = new QuillDeltaToHtmlConverter(noteContents, cfg)
  const html = converter.convert()

  const { Meta } = Card;


  return (<>
    <Card
      key={props.noteId}
      style={{ 'maxWidth': '75%', 'marginBottom': '25px' }}
      actions={[
        <EditOutlined key="edit" onClick={() => toggleEditorModal()}/>,
        <Dropdown
          placement="topCenter"
          arrow
          overlay={<NoteMenu id={props.noteId} deleteNote={props.deleteNote} />}
        >
          <EllipsisOutlined key="ellipsis" />
        </Dropdown>,
      ]}
    >
      <Meta
        avatar={<Avatar src={_.get(props, 'book.googleBook.volumeInfo.imageLinks.smallThumbnail')} />}
        title={_.get(props, 'book.googleBook.volumeInfo.title')}
        description= {props.tags.map(tag => {
          return <Tag
            key={tag.id}
          >
            {tag.name}
          </Tag>
        })}
      />
      <Divider />
      <Interweave key={props.noteId} content={html} transform={transform} />
    </Card>
    {showEditorModal && <NoteEditor
      toggleModal={toggleEditorModal}
      toggleSaveModal={toggleSaveModal}
      open={showEditorModal}
      noteContents={noteContents}
      saveUpdateNote={saveNoteContents}
    />}
    {showSaveModal && <SaveNote
      noteContents={noteContents}
      handleSaveNote={props.saveUpdateNote}
      toggleModal={toggleSaveModal}
      open={showSaveModal}
      books={props.books}
      private={props.private}
      book={props.book}
      noteId={props.noteId}
      tags={props.allTags}
      selectedTags={props.tags}
  />}
    </>
  )
}


const Notes: React.FC<{}> = () => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const { notes, books, tags } = initialState || {};

  const [showEditorModal, setShowModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [noteContents, setNoteContents] = useState(new Delta())
  const [filterNotes, setFilterNotes] = useState(notes)


  const toggleEditorModal = (): void => setShowModal(!showEditorModal)
  const toggleSaveModal = (): void => setShowSaveModal(!showSaveModal)

  async function asyncDeleteNote(id: number) {
    await deleteNote(id)
    const newNotes = notes.filter(note => note.id !== id)
    setInitialState({ ...initialState, notes: newNotes })
  }

  async function saveUpdateNote(saveParams: Object, tags: Array<Object>, noteId: number) {
    const noteUpdatedTagIds = notes.filter(note => note.id === noteId)[0].tags.map(tag => tag.id)
    const updatedNote = await updateNote(saveParams, noteId)
    const tagIds = tags.tags.map(tag => tag.id)
    const tagReqValues = { tags: tagIds, club_tags: [] }
    const tagsToRemove = noteUpdatedTagIds.filter(id => !tagIds.includes(id))
    const removeTagReqValues = { tags: tagsToRemove, club_tags: [] }

    if (tagIds.length > 0) {
      await tagNote(tagReqValues, noteId)
    }
    if (tagsToRemove.length > 0) {
      await removeTagNote(removeTagReqValues, noteId)
    }
    if (_.get(updatedNote, 'id')) {
      notes.map(note => {
        if (note.id === updatedNote.id)
          Object.assign(note, saveParams)
          Object.assign(note, tags)
      })
      setInitialState({...initialState, notes: notes})
      message.success('Note updated!');
      return
    }
    message.error('Failed to save note')
  }

  const handleAddNote = async (values: AddNoteParams, newTags: Array<Object>,) => {
    try {
      const res = await addNote({ ...values });
      if (_.get(res, 'id', false)) {
        if (newTags.tags.length > 0) {
          const tagIds = newTags.tags.map(tag => tag.id)
          const tagReqVals = { tags: tagIds, club_tags: [] }
          await tagNote(tagReqVals, res.id)
          res.tags = newTags.tags
        }
        notes.unshift(res)
        setInitialState({...initialState, notes: notes})
        message.success('Note saved!');
        return
      }
    } catch (error) {
      message.error('Failed to add note');
    }
  };

  const saveNoteContents = (nC: Array<Object>): void => setNoteContents(nC)

  const { Option } = Select;

  const handleChange = (tagName: Array<String>) => {
    if (tagName.length === 0) {
      setFilterNotes(notes)
      return
    }
    const newNotes = notes.filter(note => {
      return note.tags.filter(tag => {
        return tagName.indexOf(tag.name) > -1
      }).length > 0
    })
    setFilterNotes(newNotes)
  }

  return (
    <PageContainer>

      <Select
        mode="multiple"
        style={{ 'width': '25%', 'marginBottom': '25px', 'textAlign': 'center' }}
        allowClear
        placeholder="Filter By Tag"
        onChange={handleChange}
      >
        {tags.map(tag => {
          return (<Option key={tag.id} value={tag.name}>{tag.name}</Option>)
        })}
      </Select>
      <br />

      <Card
        style={{ 'maxWidth': '75%', 'marginBottom': '25px', 'textAlign': 'center' }}
      >
        <PlusCircleFilled onClick={() => setShowModal(!showEditorModal)}/>
      </Card>
      {filterNotes.map(note => {
        const book = books.find(obj => obj.id == note.book_id)
        return (<NoteCard
          key={note.id}
          noteId={note.id}
          content={note.content}
          tags={note.tags}
          allTags={tags}
          private={note.private}
          book={book}
          books={books}
          deleteNote={asyncDeleteNote}
          saveUpdateNote={saveUpdateNote}
        />)
      })}
    {showEditorModal && <NoteEditor
      toggleModal={toggleEditorModal}
      toggleSaveModal={toggleSaveModal}
      open={showEditorModal}
      noteContents={noteContents}
      saveUpdateNote={saveNoteContents}
      newNote  
      />}
    {showSaveModal && <SaveNote
      noteContents={noteContents}
      handleSaveNote={handleAddNote}
      toggleModal={toggleSaveModal}
      open={showSaveModal}
      books={books}
      tags={tags}
      selectedTags={[]}
    />}

    </PageContainer>
  )
};

export default Notes;