import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import { createProtest } from '../api';
import { SignUp } from '../views';
import { ProtestForm } from '../components';

function AddProtest() {
  const store = useStore();
  if (!store.userStore.user) {
    return <SignUp />;
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
