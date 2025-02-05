import React from 'react';

export const Link: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <a>{children}</a>;
};
