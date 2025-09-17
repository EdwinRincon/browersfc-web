declare const process: any;

export const environment = {
  production: false,
  API_URL: process.env['API_URL'] || 'http://localhost/api'
};
