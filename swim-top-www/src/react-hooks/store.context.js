import React, { useReducer, useEffect } from 'react';

import { open as wsConnect } from '../services/websocket';
import { swimmers as swimmersApi } from '../services/api';

// helper
function unknownAction(action) {
  const err = new Error(JSON.stringify(action));
  err.name = 'Unknown action';
  console.error(err);
}

function swimmersInit() {
  return {
    list: [],
    top: [],
  };
}

function resultsInit() {
  return {
    swimmer: null,
    modalOpened: false,
  };
}

function initialState() {
  return {
    swimmers: swimmersInit(),
    results: resultsInit(),
    socket: null,
  };
}

export const StoreContext = React.createContext();

export const SWIMMERS_ACTIONS = Object.freeze({
  LOAD: 'swimmers.load',
  UPDATE: 'swimmers.update',
  ADD: 'swimmers.add',
});

function swimmersReducer(state, action) {
  switch (action.type) {
    case SWIMMERS_ACTIONS.LOAD: {
      return {
        ...state,
        swimmers: {
          ...state.swimmers,
          list: action.payload.swimmers || [],
        },
      };
    }

    case SWIMMERS_ACTIONS.UPDATE:
      const { swimmer } = action.payload;

      const updatedList = state.swimmers.list.map((_swimmer) => {
        if (swimmer._id === _swimmer._id) {
          return swimmer;
        }

        return _swimmer;
      });

      return {
        ...state,
        swimmers: {
          ...state.swimmers,
          list: updatedList,
        },
      };

    case SWIMMERS_ACTIONS.ADD: {
      const { swimmer } = action.payload;
      state.swimmers.list.push(swimmer);
      const updatedList = state.swimmers.list.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      return {
        ...state,
        swimmers: {
          ...state.swimmers,
          list: updatedList,
        },
      };
    }

    default:
      unknownAction(action);
      return state;
  }
}

export const RESULTS_ACTIONS = Object.freeze({
  CHANGE: 'results.change',
  CANCEL: 'results.cancel',
});

function resultsReducer(state, action) {
  switch (action.type) {
    case RESULTS_ACTIONS.CHANGE: {
      const { swimmer } = action.payload;
      return {
        ...state,
        results: {
          swimmer,
          modalOpened: true,
        },
      };
    }

    case RESULTS_ACTIONS.CANCEL:
      return {
        ...state,
        results: resultsInit(),
      };
    default:
      unknownAction(action);
      return state;
  }
}

export const WS_ACTIONS = Object.freeze({
  SEND: 'ws.send',
  DATA: 'ws.data',
  OPEN: 'ws.open',
  ERROR: 'ws.error',
});

function websocketReducer(state, action) {
  switch (action.type) {
    case WS_ACTIONS.OPEN: {
      const { socket } = action.payload;

      return {
        ...state,
        socket,
      };
    }
    case WS_ACTIONS.DATA: {
      const { command, data } = action.payload;
      switch (command) {
        case 'top': {
          return {
            ...state,
            swimmers: {
              ...state.swimmers,
              top: data || [],
            },
          };
        }
        default:
          return state;
      }
    }
    case WS_ACTIONS.SEND: {
      const { event, command, data } = action.payload;

      if (state.socket) {
        state.socket.emit(event, command, data);
      }
      return state;
    }

    default:
      unknownAction(action);
      return state;
  }
}

function reducer(state, action) {
  const reducer = action.type.split('.')[0];
  switch (reducer) {
    case 'swimmers':
      return swimmersReducer(state, action);
    case 'results':
      return resultsReducer(state, action);
    case 'ws':
      return websocketReducer(state, action);
    default:
      unknownAction(action);
      return state;
  }
}

export function StoreContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, null, initialState);

  useEffect(() => {
    // load swimmers list
    swimmersApi.list().then((swimmers) => {
      dispatch({ type: SWIMMERS_ACTIONS.LOAD, payload: { swimmers } });
    });

    // connect to websocket
    const socket = wsConnect();
    socket.on('connect', () => {
      dispatch({ type: WS_ACTIONS.OPEN, payload: { socket } });
      // TODO: move out from here
      // get top list
      dispatch({
        type: WS_ACTIONS.SEND,
        payload: { event: 'users', command: 'top' },
      });
    });

    // TODO: delete hardcode
    socket.on('users', (command, data) => {
      dispatch({ type: WS_ACTIONS.DATA, payload: { command, data } });
    });

    socket.on('error', (error) => {
      dispatch({ type: WS_ACTIONS.ERROR, payload: { error } });
    });

    // unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  );
}
