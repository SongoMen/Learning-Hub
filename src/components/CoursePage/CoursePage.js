import React from "react";
import "firebase/firestore";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => ({
  ...state
});

let lessons = {
  name:[],
  content:[]
}

class CoursePage extends React.Component {
  _isMounted = false;

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }
  /*
  loadLessons() {
    if (this._isMounted)
      this.setState({
        courseName: name
      });
    lessons.name = [];
    lessons.content = [];
    let i = 0;
    db.collection("courses")
      .doc(name)
      .collection("lessons")
      .get()
      .then(snapshot => {
        if (snapshot.docs.length > 0 && this._isMounted) {
          snapshot.forEach(doc => {
            lessons.name.push(doc.id);
            lessons.content.push(doc.data()["content"]);
            i++;
          });
          this.setState({
            courses: i
          });
        } else if (this._isMounted) {
          this.setState({
            lessons: 0
          });
        }
      })
      .catch(err => {
        console.error(
          "%c%s",
          "color: white; background: red;padding: 3px 6px;border-radius: 5px",
          "Error"
        );
        console.error(err);
      });
  }*/

  render() {
    return (
      <div className="CoursePage">
        {this.props.name}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(CoursePage));
