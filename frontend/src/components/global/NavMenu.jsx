import React, {useEffect} from 'react'
import styled from 'styled-components'
import { AiOutlineClose } from "react-icons/ai";
import { menuList } from '../../data/menuListData'
import {Link, useLocation} from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import {toggleMenuOpen} from '../../slices/eventSlice';


const NavMenu = () => {
    const dispatch = useDispatch()
    const pathname = useLocation().pathname

    const {
        menuOpen
    } = useSelector((store) => store.event)
    const {
        userCookie
    } = useSelector((store) => store.auth)

    const { user } = useSelector((store) => store.user)
      const { currentAssessmentAnalysis } = useSelector((store) => store.assessment)
      const recommendedTests = user?.recommendedTests || []
    
      let newMenuList = []
    
      if (recommendedTests.length === 0 || Object.keys(user).length === 0) {
        newMenuList = menuList.filter(val => val.route !== '/assessment')
      } else if (!currentAssessmentAnalysis) {
        newMenuList = menuList.filter(val => val.route !== '/review')
      } else {
        newMenuList = menuList
      }
    
 
      useEffect(() => {
        if (menuOpen) {
            dispatch(toggleMenuOpen())
        }
      }, [pathname]);
    
  return (
    <Wrapper style={{
        height: `${menuOpen ? '100vh' : 0}`
    }}>
        <div className="header_container">
            <Link to="/" className='logo_container'>
                <h1 className='title'>AURA</h1>
            </Link>
            <div className="hm-container">
                <AiOutlineClose onClick={() => dispatch(toggleMenuOpen())}/>
            </div>
        </div>
        <div className="nav_container">
            {newMenuList.map((values, index) => {
                const {title, route} = values
                return <Link 
                to={route}
                key={index}
                >
                    <p className={`nav ${pathname === route ? 'active_nav': 'inactive_nav'}`}>
                    {title}
                    </p>
                </Link>
            })}
        </div>
        <div className="btn-container">
            {
                userCookie ? <Link to="/symptomChecker" className='btn-nav'>
                <button type="button">
                    Get Started
                </button>
            </Link> :   <>
            <Link to="/login" className='btn-nav'>
                <button type="button" className='login-btn'>
                    Login
                </button>
            </Link>
             <Link to="/signup" className='btn-nav'>
                <button type="button" className='signup-btn'>
                    Signup
                </button>
            </Link>
            </>
            }
           
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display: none;

    @media only screen and (max-width: 992px) {
        position: fixed;
        height: 0;
        width: 100%;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        z-index: 5000 !important;
        background: #ffffff;
        transition: 0.1s all;
        overflow: hidden;

        .header_container {
            height: 75px;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 2rem;
            margin-top: 0.5rem;
        }

        .logo_container {
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }

        .logo {
            object-fit: cover;
        }

        .title {
            font-size: 1.5em;
            color: var(--primary-color);
        }

        .hm-container {
            font-size: 2em;
            cursor: pointer;
        }

        .nav_container {
            padding: 1.5rem 1.5rem;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .nav {
            margin-top: 2.5rem;
            font-size: 1.3em;
        }

        .active_nav {
            text-decoration: underline;
            text-decoration-thickness: 2.5px;
            text-underline-offset: 10px;
            opacity: 1;
        }      


        .inactive_nav {
            opacity: 0.7;
        }

        .btn-container {
            padding: 1rem 1rem;
            width: 100%;
            margin-top: var(--spacing-lg);
        }

        .btn-nav {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

         button {
            background: var(--primary-color);
            color: var(--white-color);
            border: none;
            width: 80%;
            height: 55px;
            border-radius: 35px;
            font-size: 1.1em;
            padding: 1rem 3rem;
            cursor: pointer;
        } 

        button:hover {
            transition: 0.3s all;
            background: none;
            color: #000;
            border: solid 1px var(--primary-color);
        }

        .home_hero_btn {
        margin-top: var(--spacing-xl);
        background: #034402;
        color: #F6FCF3;
        border: none;
        height: 50px;
        width: 200px;
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-size: var(--font-size-sm);
        z-index: 5;
        }

        .signup-btn {
            background: none;
            border: solid 1px var(--primary-color);
            color: var(--secondary-color);
            margin-top: 1rem;

        }

        .login-btn {
            background: var(--primary-color);
            color: var(--white-color);
        }

    }
`

export default NavMenu