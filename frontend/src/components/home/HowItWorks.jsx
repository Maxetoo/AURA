import React from 'react'
import styled from 'styled-components';
import {howItWorksData} from '../../data/howItWorksData';

const HowItWorks = () => {

    return (
    <Wrapper>
        <div className="secondary_wrapper">
            <h3>How AURA Works</h3>
            <p className='desc'>Our platform makes mental healhcare accessible, personalized, and effective through a simple process</p>
            <div className="service_container">
                {
                    howItWorksData.map((items, index) => {
                        const {icon, title, details} = items
                        return <div className="service_item" key={index}>
                            <div className="icon_container">
                                {icon}
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
    text-align: center;
    font-weight: 600;
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
    border: solid 0.5px var(--primary-color);
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
    color: var(--white-color);
    display: grid;
    place-content: center;
    background: var(--primary-color);
  }

  h4 {
    font-weight: 800;
    font-size: 1.3em;
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

    .service_item {
        width: 100%;
    }
    .service_container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        grid-template-rows: subgrid;
        gap: 1rem;
    }
  }
`
export default HowItWorks