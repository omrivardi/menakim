// eslint-disable-next-line
import React from 'react';
// eslint-disable-next-line
import Helmet from 'react-helmet';
import { mdx } from 'mdx.macro';
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('donate');

const Content = mdx`
<Helmet>
  <title>${t('title')}</title>
</Helmet>

## ${t('title')}

<div style={{ textAlign: 'center' }}>
${t('text1')}  
${t('text2')}    


${t('text3')}  


<p>${t('text4')}<a href="https://paypal.me/guytepper" target="_blank" rel="noreferrer noopener">${t('text5')}</a>${t(
  'text6'
)}<a href="https://docs.google.com/forms/d/e/1FAIpQLSfVKiEvHZQlrHbmXt2jfVdAbetCtwAU7gN6mSDcw9Z5eEidug/viewform"  target="_blank" rel="noreferrer noopener">${t(
  'text7'
)}</a>.</p>
${t('text8')}
${t('text9')}

${t('text10')}
${t('text11')}
</div>

`;

export default Content;
