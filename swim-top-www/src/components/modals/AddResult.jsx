import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import {
  StoreContext,
  RESULTS_ACTIONS,
  SWIMMERS_ACTIONS,
} from '../../react-hooks/store.context';
import { swimmers as swimmersApi } from '../../services/api';

export function AddResult(props) {
  const [resultValue, setResultValue] = useState(0);

  const {
    state: { results },
    dispatch,
  } = useContext(StoreContext);

  const cancel = () => {
    dispatch({ type: RESULTS_ACTIONS.CANCEL });
    setResultValue(0);
  };

  const submit = () => {
    // update result
    swimmersApi
      .update(results.swimmer._id, {
        result: resultValue + results.swimmer.result
      })
      .then((swimmer) => {
        dispatch({
          type: SWIMMERS_ACTIONS.UPDATE,
          payload: {
            swimmer,
          },
        });
        cancel();
      });
  };

  const increseResult = (val) => setResultValue(resultValue * 1 + val);

  return (
    <Modal show={results.modalOpened} onHide={cancel}>
      <Modal.Header closeButton>
        <Modal.Title>Обновление результата</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {results.swimmer && (
          <Card
            className="text-center"
            bg="light"
            style={{ marginBottom: '15px' }}
          >
            <Card.Body>
              <Card.Title>{results.swimmer.name}</Card.Title>
              <Card.Text>
                Текущий результат: <b>{results.swimmer.result}</b>, м.
              </Card.Text>
            </Card.Body>
          </Card>
        )}
        <Form>
          <Form.Group controlId="fieldDistance">
            <Form.Label>Протяженность заплыва, м</Form.Label>
            <Form.Control
              type="number"
              placeholder="введите результат"
              value={resultValue}
              onChange={(e) => setResultValue(e.target.value)}
            />
          </Form.Group>
        </Form>
        {[25, 50, 100, 500, 1000].map((val, i) => (
          <Button
            variant="secondary"
            onClick={() => increseResult(val)}
            style={{ margin: '5px' }}
            key={i}
          >
            +{val}
          </Button>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={cancel}>
          Отменить
        </Button>
        <Button variant="primary" onClick={submit} disabled={resultValue <= 0}>
          Обновить
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
