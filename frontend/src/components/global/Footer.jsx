import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {menuList} from '../../data/menuListData'
import {socialData} from '../../data/socialData'

const Footer = () => {
  return (
    <Wrapper>
        <div className="footer_desc_container">
          <h3>AURA</h3>
          <p className='logo_desc'>
          Professional mental health assessments and virtual therapy with licensed practitioners.
          </p>

          <p className='copyright_p'>
            ©2025 All rights reserved. AURA.
          </p>

          <div className="socials_container">
            {
              socialData.map((values) => {
                const {id, icon, link} = values
                return <a href={link} key={id}>
                  <span className='social_icon'>
                    {icon}
                  </span>
                </a>
              })
            }
          </div>
        </div>
        <div className="footer_nav_options">
          <h3>Company</h3>
          <div className="nav_list_container">
            {
              menuList.map((values) => {
                const {_id, route, title} = values
                  return (<Link 
                    to={route}
                  className='nav_list'
                  key={_id}
                  >
                  <span>{title}</span>
                  </Link>)
              })
            }

          </div>
        </div>
        <div className="contact_details">
          <h3>Contact</h3>
          <div className="contact_list_container">
            <a href="mailto:aura@gmail.com">
            aura@gmail.com
            </a>
            <a href="tel:+2349071943338">
            +234 9071 9433 38
            </a>
          </div>
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
    margin-top: 3rem;
    min-height: 300px;
    width: 100%;
    display: grid;
    grid-template-columns: 400px repeat(auto-fill, minmax(200px, 1fr));
    grid-template-rows: subgrid;
    border-top: solid 0.5px #BBBBBB;
    gap: 2rem;
    padding: 4rem;
    z-index: 1000;
    font-size: 1em;

    h3 {
        font-weight: 800;
    }


    p {
      margin-top: var(--spacing-lg);
      width: 80%;
      line-height: 20px;
    }

    .logo_desc {
      font-weight: 500;
      margin-top: 1rem;
    }

    .copyright_p {
      color: #A4ABB8;
      font-weight: 400;
    }

    >div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    *>div {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }


    .socials_container {
      margin-top: 1rem;
      width: 50%;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .social_icon {
      margin-right: 1rem;
      font-size: 1.5em;
    }


    .nav_list {
      margin-top: 1rem;
      color: var(--font-light);

    }

    .contact_list_container a {
      margin-top: 1rem;
      color: var(--font-light);
    }

    @media only screen and (max-width: 768px) {
      padding: 3rem 2rem;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

      p {     
      width: 80%;
      }

      .copyright_p {
        max-width: 100%;
        font-size: 0.9em;
      }
    }


`

export default Footer