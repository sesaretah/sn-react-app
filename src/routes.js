import HomePage from './components/pages/HomePage';
import NotFoundPage from './components/pages/NotFoundPage';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Stream from './components/pages/Stream';
import ViewShare from './components/pages/ViewShare';
import ViewStream from './components/pages/ViewStream';
import ViewDiscussion from './components/pages/ViewDiscussion';
import ViewProfile from './components/pages/ViewProfile';
import ProfileEducations from './components/pages/ProfileEducations';
import ProfileBookmarks from './components/pages/ProfileBookmarks';


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
    path: '/streams/',
    component: Stream,
  },
  {
    path: '/shares/:shareId',
    component: ViewShare,
  },
  {
    path: '/streams/:streamId',
    component: ViewStream,
  },
  {
    path: '/discussions/:discussionId',
    component: ViewDiscussion,
  },
  {
    path: '/profiles/:profileId',
    component: ViewProfile,
  },
  {
    path: '/profiles/profile_educations/:profileId',
    component: ProfileEducations,
  },
  {
    path: '/profiles/profile_bookmarks/:profileId',
    component: ProfileBookmarks,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
