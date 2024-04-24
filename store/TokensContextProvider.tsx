'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

const TokensContext = createContext({
  tokens: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateTokens: (_: number) => {},
});

export const useTokens = () => useContext(TokensContext);

export const TokensProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState(0);

  const updateTokens = (newTokenCount: number) => {
    setTokens(newTokenCount);
  };

  return (
    <TokensContext.Provider value={{ tokens, updateTokens }}>{children}</TokensContext.Provider>
  );
};
