import React from 'react';
import FourOhFour from './four-oh-four.js';
import TermsOfUse from './terms-of-use.js';
import LegalNotice from './legal-notice.js';
import ProjectSupport from './project-support';
import One from './ProjectUpdates/one';

export const posts = [
  {
    slug: '404',
    title: 'הדף לא נמצא - מנקים את הבית',
    text: <FourOhFour />,
  },
  {
    slug: 'legal-notice',
    title: 'הבהרה משפטית - מנקים את הבית',
    permalink: '/legal-notice',
    text: <LegalNotice />,
  },
  {
    slug: 'about',
    title: 'על הפרוייקט - מנקים את החוף',
    permalink: '/about',
    text: <ProjectSupport />,
  },
  /*   {
    slug: 'donate',
    title: 'תרומה לפרוייקט - מנקים את הבית',
    permalink: '/donate',
    text: <DonatePage />,
  }, */
  {
    slug: 'terms-of-use',
    title: 'תנאי השימוש - מנקים את הבית',
    text: <TermsOfUse />,
  },
  {
    slug: '1',
    title: 'עדכון #1 - מנקים את הבית',
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
