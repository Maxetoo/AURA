import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  togglePasswordVisibility,
  fillSignupInputs,
  signup,
} from '../../slices/authSlice';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaFileImage } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { FaEye, FaEyeSlash} from "react-icons/fa";
import { uploadFile, handleSelectedInput, removeSelectedFile} from '../../slices/uploadSlice';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import {Loader, AlertError} from '../../helpers';
import {options} from '../../data/specialityData';


const DoctorRegister = () => {
  const dispatch = useDispatch();

  const {
    signupInputs: {
      firstname,
      lastname,
      email,
      password,
      dateOfBirth,
      role,
      governmentIssuedId,
     yearsOfExperience,
      specialties,
    },
    isSignupPasswordVisibleTherapist,
    signupLoad,
    signupErrorMessage,
    signupError,
  } = useSelector((store) => store.auth);

  const {
    isLoading, files: { certificate, resume, profilePicture } = {}, selectedInput
  } = useSelector((store) => store.upload);

 const handleUploadFile = (fileType, acceptType = '*') => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = acceptType;
  fileInput.multiple = false;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadFile({ file, fileType }));
    }
    document.body.removeChild(fileInput);
  });

  document.body.appendChild(fileInput);
  fileInput.click();
};


  return (
    <Wrapper>
      <h3>Therapist Register</h3>
      <form>
        {/* Firstname */}
        <label htmlFor="Firstname">
          <input
            type="text"
            placeholder="Firstname"
            value={firstname}
            onChange={(e) =>
              dispatch(
                fillSignupInputs({
                  firstname: e.target.value,
                  lastname,
                  email,
                  password,
                  dateOfBirth,
                  role,
                  governmentIssuedId,
                 yearsOfExperience,
                  specialties,
                })
              )
            }
          />
        </label>

        {/* Lastname */}
        <label htmlFor="Lastname">
          <input
            type="text"
            placeholder="Lastname"
            value={lastname}
            onChange={(e) =>
              dispatch(
                fillSignupInputs({
                  lastname: e.target.value,
                  firstname,
                  email,
                  password,
                  dateOfBirth,
                  role,
                  governmentIssuedId,
                 yearsOfExperience,
                  specialties,
                })
              )
            }
          />
        </label>

        {/* Email */}
        <label htmlFor="Email">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              dispatch(
                fillSignupInputs({
                  email: e.target.value,
                  firstname,
                  lastname,
                  password,
                  dateOfBirth,
                  role,
                  governmentIssuedId,
                 yearsOfExperience,
                  specialties,
                })
              )
            }
          />
        </label>

        {/* Password */}
        <label htmlFor="Password" className="password">
          <input
            type={isSignupPasswordVisibleTherapist ? 'text' : 'password'}
            placeholder="Password"
            className="password_input"
            value={password}
            onChange={(e) =>
              dispatch(
                fillSignupInputs({
                  password: e.target.value,
                  firstname,
                  email,
                  lastname,
                  dateOfBirth,
                  role,
                  governmentIssuedId,
                 yearsOfExperience,
                  specialties,
                })
              )
            }
          />
          <div
            className="visibility"
            onClick={() =>
              dispatch(togglePasswordVisibility({ type: 'signupTherapist' }))
            }
          >
            {isSignupPasswordVisibleTherapist ? <FaEye /> : <FaEyeSlash />}
          </div>
        </label>

        {/* Date of Birth */}
        <label htmlFor="Dateofbirth">
          <DatePicker
            className='date_input'
            selected={dateOfBirth ? new Date(dateOfBirth) : null}
            onChange={(date) =>
              dispatch(fillSignupInputs({
                  dateOfBirth: date.toISOString().split('T')[0],
                  firstname,
                  lastname,
                  email,
                  password,
                  role,
                  governmentIssuedId,
                 yearsOfExperience,
                  specialties,
                }))
            }
            placeholderText="Date of birth"
            dateFormat="yyyy-MM-dd"
          />
        </label>

        {/* Government ID */}
        <label htmlFor="GovernmentIssuedId">
          <input
            type="text"
            placeholder=" Government Issued Id"
            value={governmentIssuedId}
            onChange={(e) =>
              dispatch(
                fillSignupInputs({
                  governmentIssuedId: e.target.value,
                  firstname,
                  lastname,
                  email,
                  password,
                  dateOfBirth,
                  role,
                 yearsOfExperience,
                  specialties,
                })
              )
            }
          />
        </label>

        {/* Years of Experience */}
        <label htmlFor="YearsOfExperience">
          <input
            type="number"
            placeholder="Years of Experience"
            value={yearsOfExperience}
            min={1}
            onChange={(e) =>
              dispatch(
                fillSignupInputs({
                 yearsOfExperience: e.target.value,
                  firstname,
                  lastname,
                  email,
                  password,
                  dateOfBirth,
                  role,
                  governmentIssuedId,
                  specialties,
                })
              )
            }
          />
        </label>

        {/* Specialities  */}
        <div className="select_wrapper">
              <Select
          isMulti
          name="specialties"
          options={options}
          placeholder="Select Specialties"
          className="react-select-container"
          classNamePrefix="react-select"
         value={options.filter(option => specialties?.includes(option.value))}
          onChange={(selectedOptions) => {
            const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
            dispatch(
              fillSignupInputs({
                firstname,
                lastname,
                email,
                password,
                dateOfBirth,
                role,
                governmentIssuedId,
                yearsOfExperience,
                specialties: values,
              })
            );
          }}
          styles={{
            control: (base, state) => ({
              ...base,
              width: '100%',
              minHeight: '60px',
              backgroundColor: '#fff',
              borderRadius: '35px',
              padding: '0 0.5rem',
              border: 'solid 1.5px var(--stroke-color)',
              boxShadow: state.isFocused ? '0 0 0 0px var(--stroke-color)' : 'none',
              fontSize: '1em',
              boxSizing: 'border-box',
              flexWrap: 'wrap',
            }),
            valueContainer: (base) => ({
              ...base,
              padding: 0,
              flexWrap: 'wrap',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }),
            input: (base) => ({
              ...base,
              margin: 0,
              padding: 0,
              maxWidth: '100%',
            }),
            multiValue: (base) => ({
              ...base,
              background: '#1976d2 !important',
              color: '#fff !important',
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: '#fff', // white text
              fontSize: '0.95em',
              padding: '0 4px',
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: '#fff',
              cursor: 'pointer',
              ':hover': {
                backgroundColor: '#1565c0',
                color: '#fff',
              },
            }),
            placeholder: (base) => ({
              ...base,
              fontSize: '1em',
              color: '#aaa',
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
        />

        </div>
        

        {/* Certifications Upload */}
        <label htmlFor="Certifications">
          <div
            className="upload_file"
          >
            {isLoading && selectedInput === 'certification' ? <div className="loader_section">
              <Loader/>
            </div>
            :
            <>
             {
              certificate?.fileName ? <div className="contained_file_container">
                <AiOutlineClose 
                className='rmv_btn'
                onClick={() => dispatch(removeSelectedFile('certificate'))}
                />
                <a 
                href={certificate?.url}
                target="_blank"
                rel="noopener noreferrer"
                >{certificate.fileName}</a>
              </div> : 
              <>
                <FaFileAlt 
                className="upload_icon"
                 />
                  <p>Upload Certifications</p>
              </>
             }
            </>}
            <button type='button' 
            className='upload_btn'
            title='certification'
            onClick={(e) => {
              dispatch(handleSelectedInput(e.currentTarget.title))
              handleUploadFile('certificate', '.pdf,.doc,.docx,.png,.jpg')
            }}
            >choose</button>
          </div>
        </label>

        {/* Resume Upload */}
        <label htmlFor="Resume">
          <div
            className="upload_file"
          >
            {isLoading && selectedInput === 'resume' ? <div className="loader_section">
              <Loader/>
            </div>
            :
            <>
             {
              resume?.fileName ? <div className="contained_file_container">
                <AiOutlineClose 
                className='rmv_btn'
                onClick={() => dispatch(removeSelectedFile('resume'))}
                />
                <a 
                href={resume?.url}
                target="_blank"
                rel="noopener noreferrer"
                >{resume.fileName}</a>
              </div> : 
              <>
                <FaFileAlt className="upload_icon" />
                  <p>Upload Resume</p>
              </>
             }
            </>}
            <button type='button' 
            className='upload_btn' 
            title='resume'
            onClick={(e) => {
              dispatch(handleSelectedInput(e.currentTarget.title))
              handleUploadFile('resume', '.pdf,.doc,.docx');
            }}>choose</button>
          </div>
        </label>

        {/* Profile Picture Upload */}
        <label htmlFor="Profile picture">
          <div
            className="upload_file upload_image"
            title='picture'
            onClick={(e) => {
              dispatch(handleSelectedInput(e.currentTarget.title))
              handleUploadFile('profilePicture', 'image/*')
            }
            }
          >
            {isLoading && selectedInput === 'picture' ? <div className="loader_section">
              <Loader/>
            </div>
            :
            <>
             {
              profilePicture?.fileName ? <div className="contained_file_container">
                <AiOutlineClose 
                className='rmv_btn'
                onClick={() => dispatch(removeSelectedFile('profilePicture'))}
                />
                <img src={profilePicture?.url} alt={profilePicture?.fileName} />
              </div> : 
              <>
                <FaFileImage className="upload_icon" />
                  <p>Upload Profile Picture</p>
              </>
             }
            </>}
            <button type='button' className='upload_btn'>choose</button>
          </div>
        </label>

        <div className="alert_message_container">
          {signupError && <AlertError message={signupErrorMessage}/>}
        </div>

        {/* Submit */}
        <button
          type="button"
          className={`${signupLoad ? 'btn_load' : ''}`}
          onClick={() =>
            dispatch(
              signup({
                firstname,
                lastname,
                email,
                password,
                dateOfBirth,
                role: 'therapist',
                governmentIssuedId,
                certifications: certificate?.url,
                resume: resume?.url,
                profilePhoto: profilePicture?.url,
                yearsOfExperience,
                specialties,
              })
            )
          }
        >
          Submit
          <FaArrowRightLong />
        </button>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
   width: 100%;

    h3 {
    font-size: 1.5em;
    text-align: start;
    font-weight: 600;
    }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
    width: 100%;
    max-width: 100%;
  }

  label {
    width: 100%;
    margin-bottom: 1.5rem;

    
    >* {
      width: 100%;
    }

  }

  h4 {
    margin-top: 1rem;
    font-size: 1.3em;
  }

  input {
    width: 100%;
    height: 60px;
    border: solid 1.5px var(--stroke-color);
    border-radius: 35px;
    padding: 2rem;
    font-size: 1em;
    outline: none;
  }

  .select_wrapper {
  width: 100%;
  max-width: 100%;
  margin-bottom: 1.5rem;
}

.react-select-container {
  width: 100% !important;
  max-width: 100% !important;
  min-height: 60px;
  font-size: 1em;
}

.react-select__control {
  width: 100% !important;
  min-height: 60px !important;
  border-radius: 35px !important;
  padding: 2rem !important;
  border: solid 1.5px var(--stroke-color) !important;
  background: #ffffff !important;
  box-sizing: border-box !important;
}

.react-select__value-container {
  flex-wrap: wrap !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  padding: 0 !important;
}

.react-select__multi-value {
  background: #1976d2 !important;
  color: #fff !important;
}

.react-select__multi-value__label {
  color: #fff !important;
}

.react-select__multi-value__remove {
  color: #fff !important;
}

.react-select__multi-value__remove:hover {
  background: #1565c0 !important;
  color: #fff !important;
}

  .password {
    position: relative;
  }

  .visibility {
    position: absolute;
    left: 89%;
    top: 30%;
    font-size: 1.5em;
    color: #808080;
    cursor: pointer;
  }

  .password_input {
    padding-right: 6rem;
  }

  .alert_message_container {
    margin-top: -2rem;
    width: 85%;
    line-height: 20px;
    text-align: center;
  }


  button {
    height: 50px;
    margin-top: 3rem;
    background: var(--primary-color);
    color: var(--white-color);
    padding: 1rem 3rem;
    height: 60px;
    border: none;
    border-radius: 35px;
    font-size: 1em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .upload_file {
    width: 100%;
    min-height: 120px;
    height: auto;
    border: solid 1.5px var(--stroke-color);
    border-radius: 35px;
    padding: 2rem;
    font-size: 1em;
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    color: rgba(0, 0, 0, 0.54);
    cursor: pointer;
    text-align: center;
  }

  .upload_btn {
    margin-top: 2rem;
  }

  .contained_file_container {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .contained_file_container a {
    margin-top: 5rem;
    text-decoration: underline;
    color: var(--primary-color);
  }

  .contained_file_container img {
    height: 100%;
    width: 100%;
    max-height: 120px;
    object-fit: contain;
  }

  .rmv_btn {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 1.8em;
    z-index: 9999;
  }

  

  .loader_section {
    height: 100%;
    width: 100%;
    display: grid;
    place-content: center;
  }

  .upload_image {
    min-height: 200px;
  }

  .upload_icon {
    font-size: 2em;
  } 

  .btn_load {
    opacity: 0.8;
  }
`
export default DoctorRegister