import { InfoPage } from './';
export default {
  path: 'info',
  childRoutes: [
    { path: 'info', component: InfoPage, isIndex: true },
  ],
};
