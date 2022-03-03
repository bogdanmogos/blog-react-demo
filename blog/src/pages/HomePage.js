import { string } from "prop-types";
import React, { Component } from "react";
import Article from "../components/Article";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

export default class HomePage extends Component {
  constructor(props) {
    const indexSize = 4;
    super(props);
    this.state = {
      indexSize: indexSize,
      indexStart: 0,
      indexEnd: indexSize - 1,
      articles: [],
      totalNumberOfArticles: 0,
      isModalOpen: false,
      title: "",
      tag: "",
      author: "",
      date: `${new Date().toLocaleString("default", {
        month: "long",
      })} ${new Date().getDate()}, ${new Date().getFullYear()}`,
      imgUrl: "",
      saying: "",
      content: "",
      id: null,
      isDeleteModalOpen: false,
      isShowLoad: true,
    };
    this.getArticles = this.getArticles.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
    this.closeModalResetForm = this.closeModalResetForm.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.createNewArticle = this.createNewArticle.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.editArticle = this.editArticle.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
  }
  static propTypes = {
    second: string,
  };

  componentDidMount() {
    this.getArticles();
  }

  handleNext() {
    const { indexSize, indexStart, indexEnd } = this.state;
    this.setState(
      {
        indexStart: indexStart + indexSize,
        indexEnd: indexEnd + indexSize,
      },
      this.getArticles
    );
  }

  handlePrevious() {
    const { indexSize, indexStart, indexEnd } = this.state;
    this.setState(
      {
        indexStart: indexStart - indexSize,
        indexEnd: indexEnd - indexSize,
        //prima pagina este 0 si 3
        //a2a pagina este 4 si 4
        //nr de articole total 5
        //4 articole pe pagina
      },
      this.getArticles
    );
  }

  getArticles() {
    const { indexStart, indexEnd } = this.state;
    fetch(
      `http://localhost:3007/articles?indexStart=${indexStart}&indexEnd=${indexEnd}`
    )
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
              articles: data.articlesList,
              totalNumberOfArticles: data.numberOfArticles,
              isShowLoad: false,
            });
          });
        }.bind(this)
      )
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }

  createNewArticle() {
    const { title, tag, author, imgUrl, saying, content, date } = this.state;

    fetch("http://localhost:3007/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        imgUrl,
        imgAlt: "photo",
        content,
        tag,
        author,
        date,
        saying,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.closeModalResetForm();
        this.getArticles();
      })
      .catch((err) => console.log(err));
  }

  editArticle() {
    const { title, tag, author, imgUrl, saying, content, date, id } =
      this.state;

    fetch("http://localhost:3007/articles/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        imgUrl,
        imgAlt: "photo",
        content,
        tag,
        author,
        date,
        saying,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.closeModalResetForm();
        this.getArticles();
      })
      .catch((err) => console.log(err));
  }

  openAddModal() {
    this.setState({ isModalOpen: true });
  }

  closeModalResetForm() {
    this.setState({
      isModalOpen: false,
      title: "",
      tag: "",
      author: "",
      date: "",
      imgUrl: "",
      saying: "",
      content: "",
      id: null,
    });
  }
  closeDeleteModal() {
    this.setState({
      isDeleteModalOpen: false,
      id: null,
    });
  }

  handleChangeInput(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({ [name]: value });
  }

  openEditModal(article) {
    this.openAddModal();
    this.setState({
      id: article.id,
      title: article.title,
      tag: article.tag,
      author: article.author,
      date: article.date,
      imgUrl: article.imgUrl,
      saying: article.saying,
      content: article.content,
    });
  }

  openDeleteModal(id) {
    this.setState({
      isDeleteModalOpen: true,
      id: id,
    });
  }

  deleteArticle() {
    const articleId = this.state.id;
    if (!articleId) {
      return;
    }
    fetch("http://localhost:3007/articles/" + articleId, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        this.getArticles();
        this.closeDeleteModal();
      })
      .catch((error) => {
        this.getArticles();
        this.closeDeleteModal();
        console.error("Error:", error);
      });
  }

  render() {
    const {
      totalNumberOfArticles,
      articles,
      indexStart,
      indexEnd,
      id,
      isShowLoad,
    } = this.state;

    const filteredArticles = articles.map((article) => (
      <Article
        article={article}
        key={article.id}
        editArticle={this.openEditModal}
        deleteArticle={this.openDeleteModal}
        isDetails={false}
      />
    ));
    const isPrevious = indexStart === 0 ? false : true;
    const isNext = totalNumberOfArticles - 1 > indexEnd ? true : false;
    // 4 articole/pag si 5 articole in total => indexStart = 0 & indexEnd = 3

    if (isShowLoad) {
      return <Loader />;
    }

    return (
      <>
        <div>
          <div className="add__container">
            <button
              type="button"
              className="button open-modal"
              onClick={() => this.openAddModal()}
            >
              + Add Article
            </button>
          </div>
        </div>
        {filteredArticles}

        <Footer
          handleNext={this.handleNext}
          handlePrevious={this.handlePrevious}
          isNext={isNext}
          isPrevious={isPrevious}
        />

        <div
          id="modal-box"
          className={
            this.state.isModalOpen
              ? "modal__overlay modal__overlay--open"
              : "modal__overlay"
          }
        >
          <div className="add-modal">
            <div className="modal__content">
              <h2 className="title modal-title">Add/Edit article</h2>
              <div className="inputs__container">
                <input
                  type="text"
                  name="title"
                  className="input margin"
                  placeholder="Please enter title"
                  value={this.state.title}
                  onChange={this.handleChangeInput}
                />
                <input
                  type="text"
                  name="tag"
                  className="input"
                  placeholder="Please enter tag"
                  value={this.state.tag}
                  onChange={this.handleChangeInput}
                />
                <input
                  type="text"
                  name="author"
                  className="input margin"
                  placeholder="Please enter author"
                  value={this.state.author}
                  onChange={this.handleChangeInput}
                />
                <input
                  type="text"
                  name="date"
                  className="input"
                  placeholder="February 17, 2022"
                  disabled={true}
                  value={this.state.date}
                  onChange={this.handleChangeInput}
                />
                <input
                  type="text"
                  name="imgUrl"
                  className="input margin"
                  placeholder="Please enter image url"
                  value={this.state.imgUrl}
                  onChange={this.handleChangeInput}
                />
                <input
                  type="text"
                  name="saying"
                  className="input"
                  placeholder="Please enter saying"
                  value={this.state.saying}
                  onChange={this.handleChangeInput}
                />
              </div>
              <textarea
                name="content"
                className="textarea"
                id="textarea"
                cols="28"
                rows="7"
                placeholder="Please enter content"
                value={this.state.content}
                onChange={this.handleChangeInput}
              ></textarea>
              <div className="modal__buttons">
                <button
                  type="button"
                  className="button close-modal"
                  onClick={this.closeModalResetForm}
                >
                  Cancel
                </button>
                {id === null ? (
                  <button
                    type="button"
                    className="button button--pink"
                    onClick={this.createNewArticle}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    className="button button--pink"
                    onClick={this.editArticle}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            <div id="error-modal"></div>
          </div>
        </div>

        <div
          id="modal-alert"
          className={
            this.state.isDeleteModalOpen
              ? "modal__overlay modal__overlay--open"
              : "modal__overlay"
          }
        >
          <div id="div-modal-alert" className="add-modal add-modal--small">
            <div className="modal__content">
              <h1 className="title modal-title">Delete Article</h1>
              <p className="alert-delete-p">
                Are you sure you want to delete this article?
              </p>
              <div className="modal__buttons">
                <button
                  type="button"
                  className="button cancel-alert-button"
                  onClick={this.closeDeleteModal}
                >
                  Cancel{" "}
                </button>
                <button
                  type="button"
                  className="delete-alert-button"
                  onClick={this.deleteArticle}
                >
                  Delete{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
