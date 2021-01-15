import React from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { useStore } from '../stores';
import { createProtest } from '../api';
import { ProtestForm } from '../components';

function AddProtest() {
  const store = useStore();
  const history = useHistory();

  if (!store.userStore.user) {
    history.push('/sign-up');
  }

  return (
    <ProtestForm
      initialCoords={store.userCoordinates}
      submitCallback={async (params) => {
        const result = await createProtest({ ...params, user: store.userStore.user });
        return result;
      }}
    />
  );
}

export default observer(AddProtest);
