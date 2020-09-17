import React, { useState, } from 'react';
import _ from 'lodash';
import { Button, Modal, Form, Select, Switch, Tag, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Delta from 'quill-delta';

import { createTag } from '@/services/tags';

type SaveNoteProps = {
  noteContents: Delta,
  toggleModal: Function,
  handleSaveNote: Function,
  open: boolean,
  books: Array<Object>,
  tags: Array<Object>,
  private: Boolean,
  selectedTags: Array<Object>,
  book?: Object,
  noteId?: number,
}
const SaveNote: React.FC<SaveNoteProps> = (props) => {
  const [privateNote, setPrivateNote] = useState(props.private);
  const [bookId, setBookId] = useState(_.get(props, 'book.id'))
  const [tags, setTags] = useState(props.tags)
  const [selectedTags, setSelectedTag] = useState(props.selectedTags)
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const { CheckableTag } = Tag;

  const values = { content: JSON.stringify(new Delta(props.noteContents)), book_id: bookId, private: privateNote }
  const tagValues = {tags: selectedTags, club_tags: []}

  async function handleInputConfirm() {
    const tagNames = tags.map(tag => tag.name)
    if (inputValue && tagNames.indexOf(inputValue) === -1) {
      const res = await createTag({ name: inputValue })
      setTags([...tags, res])
    }
    message.error('Tag already exists')
    setInputVisible(false)
    setInputValue('')
  };

  const handleSelectTag = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t.id !== tag.id);
    setSelectedTag(nextSelectedTags)
  }

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
        <Button key="submit" type="primary" disabled={props.noteContents==='' || !bookId}onClick={() => props.handleSaveNote(values, tagValues, props.noteId) && props.toggleModal() }>
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
        <Select onSelect={(value) => setBookId(value)} defaultValue={_.get(props, 'book.id', null)}>
          {props.books.map(book => {
            return (<Select.Option
              key={book.id}
              value={book.id}
            >{book.googleBook.volumeInfo.title}</Select.Option>)
          })}
        </Select>
        </Form.Item>
        <Form.Item label="Private">
          <Switch checked={privateNote} onChange={() => setPrivateNote(!privateNote)} />
        </Form.Item>
        <Form.Item label="Tags">
          {!inputVisible && (
            <Tag onClick={() => setInputVisible(true)} className="site-tag-plus">
              <PlusOutlined /> New Tag
            </Tag>
          )}
          {inputVisible && (
            <Input
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={(val: string) => setInputValue(val.target.value)}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {tags.map(tag => {
            return <CheckableTag
              key={tag.id}
              checked={_.get(selectedTags.find(t => t.id === tag.id), 'id') === tag.id}
              onChange={checked => handleSelectTag(tag, checked)}
              style={{'border': '.5px solid grey'}}
            >
              {tag.name}
            </CheckableTag>
          })}
        </Form.Item>

    </Form>
    </Modal>
  )
}

export default SaveNote;