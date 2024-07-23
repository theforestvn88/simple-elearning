import React from "react"

const Paginaton = ({pages, currentPage, selectedPage, totalPage}) => {
    const selectPage = (event) => {
        event.preventDefault()

        selectedPage(event.target.value)
    }

    const pageItems = pages.map((page) => page === 'gap' ? ['...', 'page-item disabled', 0] : [page, `page-item ${currentPage === page ? "active" : ""}`, parseInt(page)])
    pageItems.unshift(['First', 'page-item', 1])
    pageItems.push(['Last', 'page-item', totalPage])

    return <ul className="pagination justify-content-center">
        {pageItems.map(([name, css, page], i) => (
            <li key={`${name}-${i}`} className={css}>
                <button className="page-link btn-link" value={page} onClick={selectPage}>{name}</button>
            </li>
        ))}
    </ul>
}

export default Paginaton
