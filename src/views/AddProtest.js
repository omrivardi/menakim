import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../stores';
import { createProtest } from '../api';
import { ProtestForm } from '../components';
import { Button, PageWrapper, PageContentWrapper } from '../components';

function AddProtest() {
  const store = useStore();
  const { t } = useTranslation('signup');

  if (!store.userStore.user) {
    return (
      <PageWrapper>
        <PageContentWrapper>
          <p>{t('noUser.message')}</p>
          <Link to="/sign-up">
            <Button>{t('noUser.action')}</Button>
          </Link>
        </PageContentWrapper>
      </PageWrapper>
    );
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
