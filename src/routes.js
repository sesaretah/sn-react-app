import HomePage from './components/pages/HomePage';
import NotFoundPage from './components/pages/NotFoundPage';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Share from './components/pages/Share';
import ViewShare from './components/pages/ViewShare';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/login/',
    component: Login,
  },
  {
    path: '/sign_up/',
    component: SignUp,
  },
  {
    path: '/articles/',
    component: Share,
  },
  {
    path: '/shares/:shareId',
    component: ViewShare,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
