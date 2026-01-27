import type { OperationVariables } from '@apollo/client';
import type {
  ObservableQueryFields,
  QueryDataOptions,
} from '@apollo/client/react';
import { useQuery } from '@apollo/client/react';
import { Navigate } from 'react-router-dom';
import { LoaderElement } from './common';
import type { BaseGqlComponentProps } from './common';
import type { ReactElement } from 'react';

interface ChildrenProps<
  TData,
  TVariables extends OperationVariables = OperationVariables,
> extends ObservableQueryFields<TData, TVariables> {
  data: TData;
  loading?: boolean;
}

export interface QueryProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
> extends Omit<QueryDataOptions<TData, TVariables>, 'children'>,
    BaseGqlComponentProps {
  children: (result: ChildrenProps<TData, TVariables>) => ReactElement;
}

interface GraphQLResponseExtension {
  statusCode?: number;
}

const Query = <
  TData,
  TVariables extends OperationVariables = OperationVariables,
>({
  client,
  query,
  children,
  variables,
  loader = (
    <div className="flex flex-grow items-center justify-center">
      <LoaderElement />
    </div>
  ),
  redirectOnErrorUrl,
  disableLoader,
  ...otherProps
}: QueryProps<TData, TVariables>) => {
  const { loading, error, data, ...other } = useQuery<TData, TVariables>(
    query,
    {
      variables,
      ...otherProps,
    }
  );

  if (loading) {
    return disableLoader ? null : loader;
  }

  if (error) {
    const graphqlException = error.graphQLErrors[0]?.extensions?.response;
    console.error(error);

    const responseExtension = graphqlException as
      | GraphQLResponseExtension
      | undefined;
    const authError = responseExtension?.statusCode === 401;
    if (authError) {
      console.error('Auth error');
      return null;
    }

    if (redirectOnErrorUrl) {
      return <Navigate to={redirectOnErrorUrl} />;
    }

    return null;
  }

  if (data) {
    return children({ data, loading, ...other });
  }

  return null;
};

export default Query;
