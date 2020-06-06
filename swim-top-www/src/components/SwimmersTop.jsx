import React, { useContext } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';

import { StoreContext } from '../react-hooks/store.context';

export function SwimmersTop(props) {
  const {
    state: {
      swimmers: { top },
    },
  } = useContext(StoreContext);

  return (
    <Alert variant="success">
      <h1 className="text-center">
        <span role="img" aria-label="rating">
          🏅
        </span>{' '}
        Рейтинг{' '}
        <span role="img" aria-label="rating">
          🏅
        </span>
      </h1>
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Имя</th>
            <th>Результат, м.</th>
          </tr>
        </thead>
        <tbody>
          {top.map(({ name, result, _id }, i) => (
            <tr key={_id}>
              <td>{i + 1}</td>
              <td>{name}</td>
              <td>
                <b>{result}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Alert>
  );
}
