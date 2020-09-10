import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} Luxon Data All Rights Reserved.`}
    links={false}
  />
);
