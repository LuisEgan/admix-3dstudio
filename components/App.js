import { connect } from "react-redux";
import Head from "next/head";
import Router from "next/router";
import SideMenu from "./SideMenu";

class AppWrapper extends React.Component {
  render() {
    const { children, isLoggedIn } = this.props;
    const {
      router: { pathname },
    } = Router;

    if (!isLoggedIn && pathname !== "/login") {
      Router.push("/login");
      return null;
    }

    return (
      <main>
        <Head>
          <title>Admix - 3D Studio</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
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
