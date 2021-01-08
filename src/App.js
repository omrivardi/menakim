import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { useStore } from './stores';
import { observer } from 'mobx-react-lite';
import { useTracking } from './hooks/useTracking';
import { RenderRoutes as Routes } from './routes/RenderRoutes';
import { Header } from './components';

function App() {
  const store = useStore();
  const { t } = useTranslation();

  useTracking();

  return (
    <AppWrapper>
      <Helmet
        titleTemplate={`%s - ${t('title')}`}
        defaultTitle={t('title')}
        onChangeClientState={(newState) => store.setCurrentPageTitle(newState.title)}
      ></Helmet>
      <Header />
      <Routes />
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  display: grid;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
`;

export default observer(App);
