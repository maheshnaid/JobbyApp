import {Link} from 'react-router-dom'

import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    location,
    title,
    rating,
    jobDescription,
    employmentType,
    packagePerAnnum,
    id,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="list-item">
      <li>
        <div className="JobItem-container">
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
          <div className="location-internship-package-con">
            <div className="location-internship">
              <MdLocationOn className="location-icon" />
              <p className="location">{location}</p>
              <BsBriefcaseFill className="internship-icon" />
              <p className="employment-type">{employmentType}</p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <h1 className="description-heading">Description</h1>
          <p className="description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
