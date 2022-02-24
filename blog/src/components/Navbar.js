import React from 'react'

export default function Navbar() {
    const nav = ["HOME", "REVIEWS", "ABOUT", "CONTACTS"]
    return (
        <div className="nav">
            <ul className="nav__container">
                {nav.map((item, index) => (
                    <li key={index} className="nav__item">
                       
                       <a  className='nav__link'>{item}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
