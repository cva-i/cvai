import type {
  OperationVariables,
  MutationFunctionOptions,
  FetchResult,
} from '@apollo/client';
import type { MutationHookOptions } from '@apollo/client/react';
import { useMutation } from '@apollo/client/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import type { ReactElement } from 'react';

interface ChildrenProps<
  TData,
  TVariables extends OperationVariables = OperationVariables,
> {
  mutate: (
    options?: MutationFunctionOptions<TData, TVariables>
  ) => Promise<FetchResult<TData>>;
  loading: boolean;
  error?: Error;
  data?: TData;
}

export interface MutationProps<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
> extends MutationHookOptions<TData, TVariables> {
  children: (result: ChildrenProps<TData, TVariables>) => ReactElement;
  showErrorToast?: boolean;
  customErrorMessage?: string;
}

function Mutation<
  TData,
  TVariables extends OperationVariables = OperationVariables,
>({
  children,
  showErrorToast = true,
  customErrorMessage,
  mutation,
  ...mutationOptions
}: MutationProps<TData, TVariables>) {
  const [mutate, { loading, error, data }] = useMutation<TData, TVariables>(
    mutation,
    mutationOptions
  );

  useEffect(() => {
    if (error && showErrorToast) {
      const graphqlException = error.graphQLErrors?.[0]?.extensions?.response;
      const authError =
        (graphqlException as { statusCode?: number })?.statusCode === 401;

      if (authError) {
        console.error('Auth error');
        return;
      }

      const errorMessage =
        customErrorMessage || error.message || 'An error occurred';
      toast.error(errorMessage);
      console.error(error);
    }
  }, [error, showErrorToast, customErrorMessage]);

  return children({ mutate, loading, error, data: data ?? undefined });
}

export default Mutation;
