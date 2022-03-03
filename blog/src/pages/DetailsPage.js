import { string } from "prop-types";
import React, { Component } from "react";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Article from "../components/Article";
import Loader from "../components/Loader";

class DetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      tag: "",
      author: "",
      date: "",
      imgUrl: "",
      saying: "",
      content: "",
      id: "",
      nextId: null,
      prevId: null,
      isShowLoad: true,
    };
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.getArticle = this.getArticle.bind(this);
  }
  static propTypes = {
    second: string,
  };

  handleNext() {
    const { nextId } = this.state;
    const { navigate } = this.props;
    navigate(nextId, { replace: true });
  }

  handlePrevious() {
    const { prevId } = this.state;
    const { navigate } = this.props;
    navigate(prevId, { replace: true });
  }

  getArticle() {
    const articleId = this.props.params.id;

    fetch(`http://localhost:3007/articles/${articleId}`)
      .then(
        function (response) {
          if (response.status !== 200) {
            console.log(
              "Looks like there was a problem. Status Code: " + response.status
            );
            return;
          }
          response.json().then((data) => {
            this.setState({
              ...data,
              isShowLoad: false,
            });
          });
        }.bind(this)
      )
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }

  componentDidMount() {
    this.getArticle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params !== this.props.params) {
      this.getArticle();
    }
  }

  render() {
    const {
      nextId,
      prevId,
      title,
      tag,
      author,
      date,
      imgUrl,
      saying,
      content,
      id,
      isShowLoad,
    } = this.state;
    const isNext = nextId === null ? false : true;
    const isPrevious = prevId === null ? false : true;
    const article = { title, tag, author, date, imgUrl, saying, content, id };

    if (isShowLoad) {
      return <Loader />;
    }

    return (
      <div>
        <Article article={article} isDetails={true} />
        <Footer
          handleNext={this.handleNext}
          handlePrevious={this.handlePrevious}
          isNext={isNext}
          isPrevious={isPrevious}
        />
      </div>
    );
  }
}

const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();
  const navigate = useNavigate();
  return <WrappedComponent {...props} params={params} navigate={navigate} />;
};

export default withRouter(DetailsPage);
