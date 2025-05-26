import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import { useDispatch } from 'react-redux'
import {toggleMenuOpen} from '../../slices/eventSlice';

const Header = () => {
  const dispatch = useDispatch();


  return (
    <Wrapper>
        <Link to={'/'}>
      <h1 className='title'>
        <span>AURA</span>
      </h1>
      </Link>
      <div className="icon-container hamburger" onClick={() => dispatch(toggleMenuOpen())}>
        <IoMdMenu className='header--icon' />
      </div>
    </Wrapper>
  )
}


const Wrapper = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 75px;
    max-height: 75px;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: #ffff;
    border-bottom: solid 0.5px #BBBBBB;
    z-index: 500;

    .title {
      font-size: 1.5em;
      color: var(--primary-color);
    }


    a {
      height: 40px;
      width: auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
    }

    img {
      height: 100%;
      object-fit: cover;
      margin-right: 1rem;
    }


    .header--icon {
      font-size: 2em;
      cursor: pointer;
    }


  @media only screen and (min-width: 992px) {
    display: none;
  }

`
export default Header