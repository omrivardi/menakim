import React from 'react';
import FourOhFour from './four-oh-four.js';
import LegalNotice from './legal-notice.js';
import ProjectSupport from './project-support';
import One from './ProjectUpdates/one';

export const posts = [
  {
    slug: '404',
    title: 'הדף לא נמצא - קילומטר  אחד',
    text: <FourOhFour />,
  },
  {
    slug: 'legal-notice',
    title: 'הבהרה משפטית - קילומטר אחד',
    permalink: '/legal-notice',
    text: <LegalNotice />,
  },
  {
    slug: 'about',
    title: 'על הפרוייקט - קילומטר אחד',
    permalink: '/about',
    text: <ProjectSupport />,
  },
  /*   {
    slug: 'donate',
    title: 'תרומה לפרוייקט - קילומטר אחד',
    permalink: '/donate',
    text: <DonatePage />,
  }, */
  {
    slug: '1',
    title: 'עדכון #1 - קילומטר אחד',
    text: <One />,
  },
];

export default posts;

/*

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
*/
