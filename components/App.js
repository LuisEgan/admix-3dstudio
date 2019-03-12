import Header from "./Header";
import Head from "next/head";
import SideMenu from "./SideMenu";

class AppWrapper extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <main>
        <SideMenu />
        {children}
      </main>
    );
  }
}

export default AppWrapper;
