import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {RiShareBoxLine} from 'react-icons/ri'

import Header from '../Header'
import SimilarJob from '../SimilarJob'

import './index.css'

const apiStatusConstant = {
  initial: 'INITiAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemRoute extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  updateJobData = each => ({
    companyLogoUrl: each.company_logo_url,
    companyWebsite: each.company_website_url,
    employmentType: each.employment_type,
    id: each.id,
    jobDescription: each.job_description,
    lifeAtCompany: {
      description: each.life_at_company.description,
      imageUrl: each.life_at_company.image_url,
    },
    location: each.location,
    packagePerAnnum: each.package_per_annum,
    rating: each.rating,
    title: each.title,
    skills: each.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const jobUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const jobResponse = await fetch(jobUrl, options)
    const jobDetails = await jobResponse.json()
    console.log(jobDetails)
    if (jobResponse.ok) {
      const updatedJobData = this.updateJobData(jobDetails.job_details)
      console.log(updatedJobData)
      this.setState({jobDetails: updatedJobData})

      const updateSimilarJobData = jobDetails.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      //   console.log(updateSimilarJobData)
      this.setState({
        similarJobs: updateSimilarJobData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    return (
      <ul className="similar-jobs-list-con">
        {similarJobs.map(each => (
          <SimilarJob similarJobDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderJobRouteView = () => {
    const {jobDetails} = this.state
    const {
      title,
      companyLogoUrl,
      companyWebsite,
      packagePerAnnum,
      rating,
      location,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <>
        <div className="job-details-container">
          <div className="job-container">
            <div className="logo-container">
              <img
                src={companyLogoUrl}
                alt="company logo"
                className="company-logo-img"
              />
              <div className="role-rating-con">
                <h1 className="job-role">{title}</h1>
                <div className="rating-icon-con">
                  <AiFillStar className="star" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-employment-package-con">
              <div className="location-employment-con">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
                <BsBriefcaseFill className="case-icon" />
                <p className="employment-type">{employmentType}</p>
              </div>
              <p className="package">{packagePerAnnum}</p>
            </div>
            <hr className="line" />
            <div className="description-share">
              <p className="description-heading">Description</p>
              <a href={companyWebsite} className="visit">
                Visit <RiShareBoxLine className="share-icon" />
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
            <p className="skills-heading">Skills</p>
            <ul className="skills-list">
              {skills.map(each => (
                <li key={each.name} className="skill-item">
                  <img
                    src={each.imageUrl}
                    alt={each.name}
                    className="skill-icon"
                  />
                  <p className="skill-name">{each.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="life-at-company-heading">Life At Company</h1>
            <div className="life-at-company-con">
              <p className="life-at-company-des">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.imageUrl}
                className="life-at-company-img"
                alt="life at company"
              />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <div>{this.renderSimilarJobs()}</div>
        </div>
      </>
    )
  }

  onClickRetry = () => this.getJobDetails()

  renderJobRouteFailureView = () => (
    <div className="job-route-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-route-failure-image"
      />
      <h1 className="job-route-failure-heading">Oops! Something Went Wrong</h1>
      <p className="job-route-failure-note">
        We cannot seem to find the page your looking for.
      </p>
      <button className="retry-btn" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" height="50" width="50" color="#4f46e5" />
    </div>
  )

  renderApiStatusView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.progress:
        return this.renderLoader()
      case apiStatusConstant.success:
        return this.renderJobRouteView()
      case apiStatusConstant.failure:
        return this.renderJobRouteFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="main-container">{this.renderApiStatusView()}</div>
      </>
    )
  }
}

export default JobItemRoute
