import React, { useState, useEffect } from "react"

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [hideTimeout, setHideTimeout] = useState(null) 

  const styles = {
    button: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "10px 20px",
      fontSize: "18px",
      backgroundColor: "rgba(125, 132, 146, 0.8)",
      color: "#fff",
      border: "2px solid rgba(125, 132, 146, 0.8)",
      borderRadius: "5px",
      cursor: "pointer",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1), 0 0 15px rgba(125, 132, 146, 0.6)",
      transition: "opacity 0.5s ease, box-shadow 0.3s ease",
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? "auto" : "none",
    },
    icon: {
      width: "20px",
      height: "20px",
      fill: "#fff",
    },
  }

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)

      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }

      const timeout = setTimeout(() => {
        setIsVisible(false)
      }, 3000)

      setHideTimeout(timeout)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
    }
  }, [hideTimeout])

  return (
    <div>
      {isVisible && (
        <button 
            onClick={scrollToTop} 
            style={styles.button}
            title="Go to top"
            aria-label="Go to top"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={styles.icon} aria-hidden="true">
                <path d="M 17.418 14.908 C 17.69 15.176 18.127 15.176 18.397 14.908 C 18.667 14.64 18.668 14.207 18.397 13.939 L 10.489 6.109 C 10.219 5.841 9.782 5.841 9.51 6.109 L 1.602 13.939 C 1.332 14.207 1.332 14.64 1.602 14.908 C 1.873 15.176 2.311 15.176 2.581 14.908 L 10 7.767 L 17.418 14.908 Z"></path>         
            </svg>
        </button>
      )}
    </div>
  )
}

export default ScrollToTopButton
