import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { SwimmersList } from './components/SwimmersList';
import { SwimmersTop } from './components/SwimmersTop';

import './App.css';

function App() {
  return (
    <Container fluid style={{ padding: '10px' }}>
      <Row>
        <Col lg={7} md={7}>
          <SwimmersList />
        </Col>
        <Col lg={5} md={5}>
          <SwimmersTop />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
