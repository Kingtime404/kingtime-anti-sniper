import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface Token {
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  createdAt: string;
  contractAddress: string;
  network: string;
  userId: string;
}

const TOKENS_STORAGE_KEY = '@crypto_tokens';

const generateContractAddress = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

export const [TokenProvider, useTokens] = createContextHook(() => {
  const { user, updateUser } = useAuth();
  const [tokens, setTokens] = useState<Token[]>([]);
  const queryClient = useQueryClient();

  const tokensQuery = useQuery({
    queryKey: ['tokens', user?.id, user],
    queryFn: async () => {
      if (!user) return [];
      const stored = await AsyncStorage.getItem(TOKENS_STORAGE_KEY);
      const allTokens: Token[] = stored ? JSON.parse(stored) : [];
      return allTokens.filter(t => t.userId === user.id);
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (tokensQuery.data) {
      setTokens(tokensQuery.data);
    }
  }, [tokensQuery.data]);

  const createTokenMutation = useMutation({
    mutationFn: async ({ name, symbol, totalSupply, decimals, network }: {
      name: string;
      symbol: string;
      totalSupply: string;
      decimals: number;
      network: string;
    }) => {
      if (!user) throw new Error('Must be logged in');
      
      const newToken: Token = {
        id: Date.now().toString(),
        name,
        symbol: symbol.toUpperCase(),
        totalSupply,
        decimals,
        network,
        contractAddress: generateContractAddress(),
        createdAt: new Date().toISOString(),
        userId: user.id,
      };
      
      const stored = await AsyncStorage.getItem(TOKENS_STORAGE_KEY);
      const allTokens: Token[] = stored ? JSON.parse(stored) : [];
      allTokens.push(newToken);
      await AsyncStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(allTokens));
      
      await updateUser({ tokensGenerated: (user.tokensGenerated || 0) + 1 });
      
      return newToken;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens', user?.id] });
    },
  });

  const createToken = useCallback((data: {
    name: string;
    symbol: string;
    totalSupply: string;
    decimals: number;
    network: string;
  }) => {
    return createTokenMutation.mutateAsync(data);
  }, [createTokenMutation.mutateAsync]);

  return {
    tokens,
    createToken,
    isLoading: tokensQuery.isLoading,
    isCreating: createTokenMutation.isPending,
    createError: createTokenMutation.error?.message || null,
  };
});
