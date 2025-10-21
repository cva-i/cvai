import { match, P } from 'ts-pattern';

export function getUserDisplayName(user: { firstName: string; lastName: string }): string | undefined {
  return match({ firstName: user.firstName, lastName: user.lastName })
    .with({ firstName: P.string.minLength(1), lastName: P.string.minLength(1) }, ({ firstName, lastName }) => `${firstName} ${lastName}`)
    .with({ firstName: P.string.minLength(1) }, ({ firstName }) => firstName)
    .with({ lastName: P.string.minLength(1) }, ({ lastName }) => lastName)
    .otherwise(() => undefined);
}
