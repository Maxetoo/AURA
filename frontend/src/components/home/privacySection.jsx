import React from 'react'
import styled from 'styled-components';
import {privacyData} from '../../data/privacyData';

const privacySection = () => {
  return (
    <Wrapper>
        <div className="secondary_wrapper">
            <h3>Your Privacy and Security is Our Priority</h3>
            <p className='desc'>We understand the sensitive nature of mental health information. Our platform is built with the highest standards of security and compliance with healthcare regulations.</p>
            <div className="service_container">
                {
                    privacyData.map((items, index) => {
                        const {icon, title, details} = items
                            return <div className="service_item" key={index}>
                                <div className="icon_container">
                                    <img src={icon} alt="" />
                                </div>
                                <h4>{title}</h4>
                                <p>{details}</p>
                            </div>
                            })
                        }
                    </div>
                </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    margin-top: 3rem;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 5em;

  .secondary_wrapper {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .secondary_wrapper h3 {
    font-size: 2em;
    font-weight: 600;
    text-align: center;
  }

  .secondary_wrapper .desc {
    margin-top: 2rem;
    text-align: center;
    font-size: 1em;
    line-height: 25px;
  }

  .service_container {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .service_item {
    height: 300px;
    width: 100%;
    margin-top: 1rem;
    padding: 1.5rem;
    background: #F7F6F5;
    border-radius: 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }

  .icon_container {
    height: 70px;
    width: 70px;
    border-radius: 50%;
    font-size: 1.5em;
    display: grid;
    place-content: center;
  }

  h4 {
    font-weight: 800;
    font-size: 2em;
  }

  .service_item p {
    text-align: center;
    font-size: 1em;
    line-height: 25px;
    width: 90%;
  }

  @media only screen and (min-width: 600px) {
    .desc {
        width: 70%;
    }

    .service_item {
        width: 80%;
    }
  }


  @media only screen and (min-width: 992px) {
    .secondary_wrapper .desc {
        width: 50%;
    }
    .service_container {
        width: 90%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-template-rows: subgrid;
        gap: 1rem;
    }

    .service_item {
        width: 100%;
    }


  }
`
export default privacySection