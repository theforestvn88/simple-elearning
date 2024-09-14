import React, { useEffect, useRef, useState } from "react"

const Suggestion = ({selectedInputRef, onQuery, queryResult, textAttribute, selected, onSelected}) => {
    const inputRef = selectedInputRef || useRef()
    const suggestList = useRef()
    const [key, setKey] = useState(null)
    const [items, setItems] = useState(null)

    useEffect(() => {
        setItems(queryResult.data)
    }, [queryResult])

    useEffect(() => {
        if (!key || key == '') return

        onQuery(key)
    }, [key])

    const onChangeKey = (event) => {
        setKey(event.target.value)
    }

    const onClick = (event) => {
        selected = queryResult.data[event.target.value]
        setItems(null)
        inputRef.current.value = selected[textAttribute]
        onSelected(selected.id)
    }

    return (
        <div className="suggestions-container">
            <input ref={inputRef} id="suggestionInput" defaultValue="" type="text" className="form-control" onChange={onChangeKey} />
            {items && <ul ref={suggestList} className="suggestions list-unstyled">
                {items.map((item, index) => (
                    <li key={index} value={index} className={selected === item ? 'suggestion-active' : ''} onClick={onClick}>
                        {item[textAttribute]}
                    </li>
                ))}
            </ul>}
        </div>
    )
}

export default Suggestion
