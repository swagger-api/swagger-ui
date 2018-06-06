import React from 'react'
import Logo from './arc-logo_white.svg'

const Topbar = () => {
  return (
    <div className='navbar arc-navbar' id="topofpage">
      <div className='navbar-header'>
        <button
          type='button'
          className='navbar-toggle'
          data-toggle='collapse'
          data-target='#navCollapse'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='sr-only'>Toggle navigation</span>
          <span className='icon-bar' />
          <span className='icon-bar' />
          <span className='icon-bar' />
        </button>
        <div>
          <a href='/'>
            <img className='arc-logo' src={Logo} alt='Arc Logo' />
          </a>
          <a href='/alc'>
            <div className='navbar-brand'>
              <h4>Learning Center</h4>
            </div>
          </a>
        </div>
      </div>
      <div className='collapse navbar-collapse' id='navCollapse'>
        <ul className='nav navbar-nav'>
          <li className='menu-item'>
            <a href='/answers'> arc answers</a>
          </li>
          <li className='menu-item'>
            <a href='https://arcpublishing.atlassian.net/servicedesk/customer/portal/2'> contact support </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Topbar
