import React from 'react';
import FourOhFour from './four-oh-four.js';
import LegalNotice from './legal-notice.js';
import ProjectSupport from './project-support';
import DonatePage from './donate-page';
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
    title: 'על הפרוייקט - מנקים את הבית',
    permalink: '/about',
    text: <ProjectSupport />,
  },
  {
    slug: 'donate',
    title: 'תרומה לפרוייקט - מנקים את הבית',
    permalink: '/donate',
    text: <DonatePage />,
  },
  {
    slug: '1',
    title: 'עדכון #1 - מנקים את הבית',
    text: <One />,
  },
];

export default posts;
