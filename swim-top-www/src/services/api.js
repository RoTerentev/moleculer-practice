const API_URL = window.location.origin + '/api/v1';

function endpoint(path) {
  return API_URL + path;
}

export const swimmers = {
  list: () => {
    return fetch(endpoint('/users'), {
      credentials: 'include',
    }).then((response) => response.json());
  },

  update: (id, updateData) => {
    return fetch(endpoint(`/users/${id}`), {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    }).then((response) => response.json());
  },

  create: (userData) => {
    return fetch(endpoint(`/users`), {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).then(async (response) => {
      const res = await response.json();
      if(response.ok) {
        return res;
      }

      return Promise.reject(res);
    });
  },
};
