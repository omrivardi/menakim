import React from 'react';
import FourOhFour from './four-oh-four.js';
import LegalNotice from './legal-notice.js';
import ProjectSupport from './project-support';
import DonatePage from './donate-page';
import One from './ProjectUpdates/one';
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('translations');

export const posts = [
  {
    slug: '404',
    title: t('404'),
    text: <FourOhFour />,
  },
  {
    slug: 'legal-notice',
    title: t('legal-notice'),
    permalink: '/legal-notice',
    text: <LegalNotice />,
  },
  {
    slug: 'about',
    title: t('about'),
    permalink: '/about',
    text: <ProjectSupport />,
  },
  {
    slug: 'donate',
    title: t('donate'),
    permalink: '/donate',
    text: <DonatePage />,
  },
  {
    slug: '1',
    title: t('1'),
    text: <One />,
  },
];

export default posts;
