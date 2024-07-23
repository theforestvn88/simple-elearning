import React, { useCallback, useMemo } from "react"

const CardListPlaceHolders = ({rowSize, colSize}) => {
    const Rows = [...Array(colSize)].map((_, ci) => <div key={ci} className="col">
        <div className="card">
            <div className="card-header p-0 card-img-top img-fluid w-100" />
            <div className="card-body">
                <h5 className="card-title placeholder-glow">
                <span className="placeholder col-6"></span>
                </h5>
                <p className="card-text placeholder-glow">
                <span className="placeholder col-7"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-6"></span>
                <span className="placeholder col-8"></span>
                </p>
                <a href="#" tabIndex="-1" className="btn btn-primary disabled placeholder col-6"></a>
            </div>
        </div>
    </div>)

    return (
        <div className="container">
        {[...Array(rowSize)].map((_, ri) => <div key={ri} className="row m-1">{Rows}</div>)}
        </div>
    )
}

export default CardListPlaceHolders
