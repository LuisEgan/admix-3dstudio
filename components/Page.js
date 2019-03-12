import { connect } from "react-redux";
import Clock from "./Clock";
import AddCount from "./AddCount";

class Page extends React.Component {
  render() {
    const { title, lastUpdate, light } = this.props;
    return (
      <div>
        <h1>Redux: {title}</h1>
        <Clock lastUpdate={lastUpdate} light={light} />
        <AddCount />
        <style jsx>{`
          h1 {
            font-size: 20px;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { clock } = state;

  return { ...clock };
};

Page = connect(mapStateToProps)(Page);

export default Page;
