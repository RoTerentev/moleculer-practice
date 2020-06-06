import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';

import { StoreContext, RESULTS_ACTIONS } from '../react-hooks/store.context';

export function SwimmersListItem({ swimmer, position }) {
  const { dispatch } = useContext(StoreContext);

  return (
    <tr>
      <td>{position}</td>
      <td>{swimmer.name}</td>
      <td>
        <div className="d-flex justify-content-between">
          {swimmer.result}
          <Button
            variant="link"
            title="Обновить результат"
            style={{ marginLeft: '5px' }}
            onClick={() =>
              dispatch({ type: RESULTS_ACTIONS.CHANGE, payload: { swimmer } })
            }
          >
            обновить
          </Button>
        </div>
      </td>
    </tr>
  );
}
