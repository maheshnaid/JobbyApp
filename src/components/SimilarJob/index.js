import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJob = props => {
  const {similarJobDetails} = props
  const {
    title,
    companyLogoUrl,
    rating,
    location,
    employmentType,
    jobDescription,
  } = similarJobDetails

  return (
    <li className="similar-job-item">
      <div className="similar-job-item-con">
        <div className="companyLogo-role-rating">
          <img
            src={companyLogoUrl}
            className="company-logo"
            alt="company logo"
          />
          <div className="role-rating">
            <p className="role">{title}</p>
            <div className="role-rating-flex">
              <AiFillStar className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="description-heading">Description</h1>
        <p className="description">{jobDescription}</p>
        <div className="location-internship">
          <MdLocationOn className="location-icon" />
          <p className="location">{location}</p>
          <BsBriefcaseFill className="internship-icon" />
          <p className="employment-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJob
