import _ from 'lodash';
import React, { useState } from 'react';
import { Input, message, Card, Row, Col } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

import { queryGoogleBooks } from '@/services/books';

const { Meta } = Card;

const exploreLayout = {
  'paddingTop': '30px',
  'paddingLeft': '30px',
  'paddingBottom': '30px',
}



const GoogleBookResult: React.FC<{ bookRes: Object }> = ({ ...bookRes }) => {
  const { data } = bookRes;
  const imageLink = _.get(data, 'volumeInfo.imageLinks.thumbnail', '')
  const {title} = data.volumeInfo;
  const authors = _.get(data, 'volumeInfo.authors', ['Unknown Author']).toString(' ')

  return (
    <Card
      size="small"
      style={{ width: 200, height: 350 }}
      hoverable
      cover={
        <img
          style={{width: 200, height: 280}}
          alt="example"
          src={imageLink}
        />
      }
    >
      <Meta
        title={title}
        description={<Ellipsis length={15} tooltip>{authors}</Ellipsis>}
      />
    </Card>
  )
}


const SearchComponent: React.FC<{}> = () => {
  const { Search } = Input;

  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([])
  //const [modalVisible, setModalVisible] = useState(false)

  const handleSearch = async (query: String) => {
    setSearching(true);
    try {
    const results = await queryGoogleBooks(query);
    if (_.get(results, 'volumes', false)) {
      setSearchResults(results.volumes)
    }
    } catch (error) {
      message.error('Login failed');
    }
    setSearching(false);
  };
  return (
    <PageContainer>
      <Search
        placeholder="Search by book title"
        enterButton="Search"
        size="large"
        onSearch={query => handleSearch(query)}
        loading={searching}
      />
      <Row gutter={[32, 32]} style={exploreLayout}>
        {searchResults.map(res => {
          return <Col key={res.id}><GoogleBookResult data={res}/></Col>
        })}
      </Row>
    

    </PageContainer>
  );
}

export default SearchComponent;
