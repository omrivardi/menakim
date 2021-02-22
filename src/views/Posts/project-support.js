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

## על הפרוייקט

המפה נבנתה על ידי מתנדבים ומתנדבות מחבורת <a href="https://www.menakimethabait.com/about" target="_blank" rel="noopener noreferrer">"מנקים את הבית"</a>.  
אם יש לך כישורי פיתוח ותרצה/י לעזור לפרוייקט, אפשר לשלוח מייל <a href="https://forms.gle/d9YitvNhZNXXiLfF6" target="_blank" rel="noopener noreferrer">מלא טופס כאן</a>.  
כנראה שלא נצליח לענות בשבועות הקרובים. אבל נחזור בהקדם.
`;

export default Content;
