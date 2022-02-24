import React from "react";
import PropTypes from 'prop-types';

function Article({ article, editArticle, deleteArticle, isDetails }) {

    const text = article.content;

    const spliced = text.substring(0, text.length / 2);
    let firstParagraph;
    let secondParagraph;
    if (text.charAt(spliced.length - 1) === '!' || text.charAt(spliced.length - 1) === '.' || text.charAt(spliced.length - 1) === '?') {
        firstParagraph = text.substring(0, text.length / 2);
    } else {
        firstParagraph = text.substring(0, spliced.lastIndexOf('.') + 1);
    }

    secondParagraph = text.substring(spliced.lastIndexOf('.') + 1);

    return (
        <>
            <h2 className="title">{article.title}</h2>
            <ul className="info__container">
                <li className="info__item">{article.tag}</li>
                <li className="info__item">
                    Added by
                    <span className="info__mark point"> {article.author}</span>
                </li>
                <li className="info__item">{article.date}</li>
            </ul>
            {!isDetails && <div className="actions__container">
                <button
                    type="button"
                    className="actions__btn border"
                    onClick={() => editArticle(article)}
                >
                    Edit
                </button>

                <button
                    type="button"
                    className="actions__btn"
                    onClick={() => deleteArticle(article.id)}
                >
                    Delete
                </button>
            </div>}
            <img src={"../" + article.imgUrl} alt={article.imgAlt}></img>


            <div className="content__container">

                {isDetails
                    ? <>
                        <p>{firstParagraph}</p>
                        <p className="saying">{article.saying}</p>
                        <p>{secondParagraph}</p>
                    </>
                    : <p>{article.content}</p>}
            </div>


            {!isDetails && <div className="readmore__container">
                <a className="btn-details" href={"article/" + article.id}>
                    <button type="button" className="button button-details">
                        Read More
                    </button>
                </a>
            </div>}
        </>
    );
}

Article.propTypes = {
    article: PropTypes.exact(
        {
            id: PropTypes.string,
            title: PropTypes.string,
            imgUrl: PropTypes.string,
            imgAlt: PropTypes.string,
            content: PropTypes.string,
            tag: PropTypes.string,
            author: PropTypes.string,
            date: PropTypes.string,
            saying: PropTypes.string,

        }
    )

}

export default Article;