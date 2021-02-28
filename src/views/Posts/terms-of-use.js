// eslint-disable-next-line
import React from 'react';
import { useTranslation } from 'react-i18next';

const Content = () => {
  const { t } = useTranslation('terms');
  return (
    <div>
      <h2>{t('head')}</h2>
      <ol>
        <li>{t('one')}</li>
        <li>{t('two')}</li>
        <li>{t('three')}</li>
        <li>{t('four')}</li>
      </ol>
    </div>
  );
};

export default Content;
