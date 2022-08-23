import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

type GetUsersResponse = {
  users: User[];
  totalCount: number;
};

export async function getUsers(currentPage: number): Promise<GetUsersResponse> {
  const { data, headers } = await api.get('users', {
    params: {
      page: currentPage,
    },
  });

  const totalCount = Number(headers['x-total-count']);

  const users = data.users.map((user: User) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(user.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return { users, totalCount };
}

export function useUsers(currentPage: number) {
  return useQuery(['users', currentPage], () => getUsers(currentPage), {
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
