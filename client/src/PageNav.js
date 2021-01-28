import React from 'react';

const PageNav = ({postsPerPage, totalPosts, paginate, currentPage}) => {

    const pageNumbers = []

    for(let i =1; i<= Math.ceil(totalPosts / postsPerPage); i++){
        pageNumbers.push(i)
    }

    return (
        <nav id='page-navbar'>
            <ul className='pagination justify-content-center'>
                {pageNumbers.map(number => (
                    <>
                        {currentPage === number ? 
                            <li key={number} className='page-item active'>
                                <button onClick={() => paginate(number)} className='page-link'>
                                    {number}
                                </button>
                            </li> 
                            : 
                            <li key={number} className='page-item'>
                                <button onClick={() => paginate(number)} className='page-link'>
                                    {number}
                                </button>
                            </li>
                        }
                    </>
                ))}  
            </ul>
        </nav>
    );




}

export default PageNav;