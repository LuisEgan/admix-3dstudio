import React from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import CaretSVG from "../assets/svg/caret-down.svg";

class Breadcrumbs extends React.Component {
  render() {
    const { breadcrumbs } = this.props;
    const allBreadcrumbs = breadcrumbs ? breadcrumbs.length : 0;
    let linkClass, lastBread;

    return (
      <div className="breadcrumbs">
        {breadcrumbs &&
          breadcrumbs.map((breadcrumb, i) => {
            lastBread = i === allBreadcrumbs - 1;
            linkClass = lastBread ? "last" : "";
            return (
              <React.Fragment key={`${breadcrumb.title}-${Math.random()}`}>
                <div key={`${breadcrumb.title}-${Math.random()}`}>
                  <Link prefetch href={breadcrumb.route}>
                    <a>{breadcrumb.title}</a>
                  </Link>
                </div>
                {!lastBread && (
                  <div key={`${breadcrumb.title}-caret`}>
                    <CaretSVG />
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </div>
    );
  }
}

Breadcrumbs = withRouter(Breadcrumbs);

export default Breadcrumbs;
