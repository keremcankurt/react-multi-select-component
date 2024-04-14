import { useEffect, useRef, useState } from "react"
import styles from "./MultiSelect.module.css"

export function MultiSelect(
  {
    fetchData=() => {},
    value, 
    options, 
    setValue, 
    loading=false, 
    searchText, 
    setSearchText,
  }) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const containerRef = useRef(null)

  function selectOption(option) {
    if (value.some(value => value.id === option.id)) {
        setValue(value.filter(o => o.id !== option.id))
      } else {
        setValue([...value, option])
      }
  }

  function isoptionselected(option) {
    return value.some(value => value.id === option.id);
  }
  useEffect(() => {
    if (isOpen) {
        fetchData()
        setHighlightedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => {
      switch (e.code) {
        case "Enter":
          setIsOpen(prev => !prev)
          
          break
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true)
            break
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue)
          }
          break
        }
        case "Tab":
          e.preventDefault();
            if (isOpen) selectOption(options[highlightedIndex])
          break
      }
    }
    containerRef.current?.addEventListener("keydown", handler)

    return () => {
      containerRef.current?.removeEventListener("keydown", handler)
    }
  }, [isOpen, highlightedIndex, options])

  function highlightText(option) {
    var regex = new RegExp('(' + searchText + ')', 'gi');

    var highlightedText = option.label.replace(regex, '<strong>$1</strong>');

    return <p dangerouslySetInnerHTML={{__html: highlightedText}}></p>;
}

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={styles.container}
      
    >
      <span className={styles.value}>
        {value.map(v => (
              <button
                key={v.value}
                onClick={e => {
                  e.stopPropagation()
                  selectOption(v)
                }}
                className={styles["option-badge"]}
              >
                {v.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))}

        <input placeholder="Rick" 
        className={styles["search-input"]}
         type="text"
         onChange={(e) => setSearchText(e.target.value)}
         onClick={() => setIsOpen(false)}
         />
      </span>
      
      <div className={styles.caret} onClick={e => {
        setIsOpen(!isOpen)
      }}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {loading ? <li className={styles["loading-indicator"]}><div className={styles["spinner"]}></div></li>
        : options.length > 0 
        ? options.map((option, index) => (
          <li
            key={option.id}
          >
            <input type="checkbox" onMouseEnter={() => setHighlightedIndex(index)} className={`${styles.option} ${
              isoptionselected(option) ? styles.selected : ""
            } ${index === highlightedIndex ? styles.highlighted : ""}`} onClick={e => {
                e.stopPropagation()
                selectOption(option)
              }} checked={isoptionselected(option)}/>
            <img src={option.image}/>
            <div>
                <p>
                    {highlightText(option)}
                </p>
                <p className={styles["desc"]}>{option.desc}</p>
            </div>
          </li>
        )) :
        <li className={styles["not-found"]}>
            Not found 
        </li>
        }
      </ul>
    </div>
  )
}