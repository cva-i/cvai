export const localhostEnvCorsUrls = [
  'http://localhost:3003',
  'http://127.0.0.1:3003',
  // localhost Gql playground
  'http://localhost:4002',
];

export const productionEnvCorsUrls = [
  'https://cva-i.github.io',
  'https://arstoien.org',
];

export function getCorsUrls(environment: string) {
  return environment === 'local' ? localhostEnvCorsUrls : productionEnvCorsUrls;
}
