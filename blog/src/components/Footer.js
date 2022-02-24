import React from 'react';

export default function Footer({ handleNext, handlePrevious, isNext, isPrevious }) {



    return (
        <>
            <footer className="footer next-button-class">
                
                {isNext ? (
                    <button
                        className="footer__link footer__link--next"
                        id="button-next"
                        onClick={handleNext}
                    >
                        next
                    </button>
                ) : (
                    <span></span>
                )}
                {isPrevious ? (
                    <button
                        className="footer__link footer__link--previous"
                        id="button-prev"
                        onClick={handlePrevious}
                    >
                        previous
                    </button>
                ) : (
                    <span></span>
                )}
            </footer>
        </>
    )
}
