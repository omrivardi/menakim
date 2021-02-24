// eslint-disable-next-line
import React from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import Helmet from 'react-helmet';
import { mdx } from 'mdx.macro';

const Content = mdx`
<Helmet>
  <title>אודות הפרוייקט</title>
</Helmet>

## על המפה

המפה נבנתה על ידי מתנדבים ומתנדבות מצוות <a href="https://www.menakimethabait.com/about" target="_blank" rel="noopener noreferrer">"מנקים את הבית"</a>.  
אם יש לך כישורי פיתוח ותרצה/י לעזור לפרוייקט, אפשר  <a href="https://forms.gle/17sdmJg9fQhxYtQQ6" target="_blank" rel="noopener noreferrer">למלא טופס כאן</a>.
יתכן ויקח זמן עד שנגיע לכל הפניות, אבל אנחנו מבטיחים לענות בהקדם האפשרי.
`;

export default Content;
