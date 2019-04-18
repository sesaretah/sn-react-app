import HomePage from './components/pages/HomePage';
import NotFoundPage from './components/pages/NotFoundPage';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Article from './components/pages/Article';
import ViewArticle from './components/pages/ViewArticle';

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
    component: Article,
  },
  {
    path: '/articles/:articleId',
    component: ViewArticle,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
