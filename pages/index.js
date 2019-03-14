import React from "react";
import Router from "next/router";

class Index extends React.Component {

  componentDidMount() {
    Router.push("/login")
  }

  render() {
    return null
  }
}

export default Index;
