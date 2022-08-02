import './styles/fonts.css';
import { useCallback, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import ToastContainer from '@components/toast/ToastContainer';
import { useUser, useUserFns } from '@contexts/userContext';
import { getUserByToken } from '@src/apis';
import Introduction from '@pages/Introduction';
import { PATH } from './utils/constant';

const Main = lazy(() => import('@pages/Main'));
const Tadak = lazy(() => import('@pages/Tadak'));
const CampFire = lazy(() => import('@pages/Campfire'));
const Profile = lazy(() => import('@pages/Profile'));

const App = (): JSX.Element => {
  const user = useUser();
  const { logUserIn } = useUserFns();

  const getUser = useCallback(async () => {
    const { data } = await getUserByToken();
    if (data) {
      logUserIn(data);
    }
  }, [logUserIn]);

  const isRoom = useCallback(() => {
    const { pathname } = location;
    const { tadak, campfire } = PATH;
    return pathname.includes(tadak) || pathname.includes(campfire);
  }, []);

  useEffect(() => {
    if (!user.login) {
      getUser();

      if (isRoom()) {
        location.replace(PATH.main);
        return;
      }
    }
  }, [getUser, user, isRoom]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route exact path="/" component={Introduction} />
            <Route path="/main" component={Main} />
            <Route path="/room/tadak" component={Tadak} />
            <Route path="/room/campfire" component={CampFire} />
            <Route path="/profile" component={Profile} />
            <Redirect from="*" to="/" />
          </Switch>
        </Suspense>
      </BrowserRouter>
      <GlobalStyles />
    </>
  );
};

export default App;
