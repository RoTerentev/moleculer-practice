import React, { useContext } from 'react';
import Table from 'react-bootstrap/Table';

import { SwimmersListItem } from './SwimmersListItem';
import { AddSwimmer } from './modals/AddSwimmer';
import { AddResult } from './modals/AddResult';

import { StoreContext } from '../react-hooks/store.context';

export function SwimmersList(props) {
  const {
    state: {
      swimmers: { list },
    },
  } = useContext(StoreContext);
  
  return (
    <>
      <h2 className="text-center">
        <span role="img" aria-label="swimmers">
          🏊‍♂️
        </span>{' '}
        Список спортсменов
      </h2>
      <AddSwimmer />

      <>
        <AddResult />
        <br />
        <br />
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Имя</th>
              <th>Результат, м.</th>
            </tr>
          </thead>
          <tbody>
            {list.map((swimmer, i) => (
              <SwimmersListItem
                swimmer={swimmer}
                key={swimmer._id}
                position={i + 1}
              />
            ))}
          </tbody>
        </Table>
      </>
    </>
  );
}
