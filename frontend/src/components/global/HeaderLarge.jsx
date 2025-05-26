import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { menuList } from '../../data/menuListData'
import { useSelector } from 'react-redux'

const HeaderLarge = () => {
  const { userCookie } = useSelector((store) => store.auth)
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

  return (
    <Wrapper>
      <Link to='/' className='title-label'>
        <h1 className='title'>AURA</h1>
      </Link>
      <div className='menu-nav-container'>
        {newMenuList.map(({ route, title }, index) => (
          <Link to={route} key={index}>
            <h3>{title}</h3>
          </Link>
        ))}
      </div>
      <div className='action-nav-container'>
        {userCookie ? (
          <div className='action-list'>
            <Link to='symptomChecker'>
              <button type='button' className='signup-btn'>Get started</button>
            </Link>
          </div>
        ) : (
          <>
            <div className='action-list'>
              <Link to='signup'>
                <button type='button' className='signup-btn'>signup</button>
              </Link>
            </div>
            <div className='action-list'>
              <Link to='login'>
                <button type='button' className='login-btn'>login</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.header`
    display: none;

    @media only screen and (min-width: 992px) {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        min-height: 75px;
        max-height: 75px;
        padding: 2rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background: #ffff;
    border-bottom: solid 0.5px #BBBBBB;
        z-index: 500;

        .title-label {
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
        }


        .title {
        font-size: 2em;
        }

        .menu-nav-container {
            width: auto;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            gap: 1.5rem;

            h3 {
                position: relative;
                /* margin-right: 1.5rem; */
            }

            .not-available {
                font-size: 0.8em;
            }

            
        }

        .action-nav-container {
            width: auto;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;

            .action-list {

                button {
                    height: 40px;
                    width: auto;
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 5px;
                    font-size: 1em;
                    display: grid;
                    place-content: center;
                }

                .signup-btn {
                    background: var(--primary-color);
                    color: var(--white-color);
                }

                .login-btn {
                    background: none;
                    border: solid 1px var(--primary-color);
                    color: var(--secondary-color);
                }
            }
        }

    }


`
export default HeaderLarge