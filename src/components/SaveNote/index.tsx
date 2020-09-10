import React, { useState, } from 'react';
import { Button, Modal, Form, Select, Switch, Tag, Input } from 'antd';
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
  selectedTags: Array<Object>,
}
const SaveNote: React.FC<SaveNoteProps> = (props) => {
  const [privateNote, setPrivateNote] = useState(false);
  const [bookId, setBookId] = useState(null)
  const [tags, setTags] = useState(props.tags)
  const [selectedTags, setSelectedTag] = useState(props.selectedTags)
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const { CheckableTag } = Tag;

  const values = { content: JSON.stringify(props.noteContents), book_id: bookId, private: privateNote }

  async function handleInputConfirm() {
    const tagNames = tags.map(tag => tag.name)
    if (inputValue && tagNames.indexOf(inputValue) === -1) {
      const res = await createTag({ name: inputValue })
      setTags([...tags, res])
    }
    setInputVisible(false)
    setInputValue('')
  };

  const handleSelectTag = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
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
        <Button key="submit" type="primary" disabled={props.noteContents==='' || !bookId}onClick={() => props.handleSaveNote(values) && props.toggleModal() }>
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
              // ref={this.saveInputRef}
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
              checked={selectedTags.indexOf(tag) > -1}
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