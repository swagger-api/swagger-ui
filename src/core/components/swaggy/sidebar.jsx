import React from "react"

const Sidebar = () => {
  return (
    <div className="sidebar">
        <div style={{display:"flex", flexDirection:"column", gap:13}}>
      <span className="menu">pet</span>
      <span className="menu">store</span>
      <span className="menu">user</span>
      </div>
    </div>
  )
}

export default Sidebar
