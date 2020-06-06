import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import {
  StoreContext,
  SWIMMERS_ACTIONS,
} from '../../react-hooks/store.context';
import { swimmers as swimmersApi } from '../../services/api';

export function AddSwimmer(props) {
  const { dispatch } = useContext(StoreContext);

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  const handleClose = () => {
    setShow(false);
    setName('');
    setEmail('');
    setErr('');
  };
  const handleShow = () => setShow(true);

  const add = () => {
    swimmersApi
      .create({ email, name })
      .then((swimmer) => {
        dispatch({ type: SWIMMERS_ACTIONS.ADD, payload: { swimmer } });
        handleClose();
      })
      .catch((err) => {
        setErr(err.message);
      });
  };

  return (
    <>
      <Button variant="secondary" onClick={handleShow}>
        + Добавить спортсмена
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Добавление спортсмена</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="fieldEmail">
              <Form.Label>Email адрес</Form.Label>
              <Form.Control
                type="email"
                placeholder="введите email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="fieldName">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                placeholder="ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Form>
          {err && (
            <Alert variant="danger" onClose={() => setErr('')} dismissible>
              <Alert.Heading>Ошибка !</Alert.Heading>
              <p>{err}</p>
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Отменить
          </Button>
          <Button variant="primary" onClick={add}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
