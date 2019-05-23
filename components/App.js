import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import SideMenu from './SideMenu';

import favicon from '../assets/img/favicon.png';

export class AppWrapper extends React.Component {
  render() {
    const { children, isLoggedIn } = this.props;
    const { router } = Router;
    const { pathname } = router || {};

    if (!isLoggedIn && pathname !== '/login' && pathname !== '/register') {
      Router.push('/login');
      return null;
    }

    return (
      <main>
        <Head>
          <title>Admix - 3D Studio</title>
          <link rel="shortcut icon" href={favicon} />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <SideMenu />
        {children}
        <style jsx>{`
          main {
            display: flex;
            height: 100vh;
          }
        `}</style>
      </main>
    );
  }
}

const mapStateToProps = state => {
  const {
    auth: { isLoggedIn },
  } = state;

  return { isLoggedIn };
};

export default connect(mapStateToProps)(AppWrapper);
