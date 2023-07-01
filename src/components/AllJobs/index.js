import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BiSearch} from 'react-icons/bi'

import Header from '../Header'

import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstant = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllJobs extends Component {
  state = {
    profile: {},
    allJobs: [],
    apiStatus: apiStatusConstant.initial,
    salary: '',
    checkboxList: [],
    userInput: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getAllJobsData()
  }

  getAllJobsData = async () => {
    const {salary, checkboxList, userInput} = this.state
    this.setState({apiStatus: apiStatusConstant.progress})
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkboxList}&minimum_package=${salary}&search=${userInput}`
    const allJobsUrl = url
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const allJobsResponse = await fetch(allJobsUrl, options)
    const allJobsResponseData = await allJobsResponse.json()
    if (allJobsResponse.ok) {
      const updateAllJobsData = allJobsResponseData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        allJobs: updateAllJobsData,
        apiStatus: apiStatusConstant.success,
        userInput: '',
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  renderEmptyJobView = () => (
    <div className="empty-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="jobs-failure-view-image"
      />
      <h1 className="failure-heading">No Jobs Found</h1>
      <p className="note">
        We could not find any jobs. Please try other filters
      </p>
    </div>
  )

  renderAllJobItems = () => {
    const {allJobs} = this.state
    const view = allJobs.length === 0

    return (
      <>
        {view ? (
          this.renderEmptyJobView()
        ) : (
          <ul className="allJobs-container">
            {allJobs.map(each => (
              <JobItem jobDetails={each} key={each.id} />
            ))}
          </ul>
        )}
      </>
    )
  }

  onClickRetry = () => this.getAllJobsData()

  renderAllJobItemsFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-view-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="note">We cannot seem to find the page your looking for.</p>
      <button className="retry-btn" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstant.progress})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const profileResponse = await fetch(profileUrl, options)
    const profileData = await profileResponse.json()
    // console.log(profileData)
    if (profileResponse.ok) {
      const updateProfileData = {
        name: profileData.profile_details.name,
        profileUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profile: updateProfileData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  onClickRetry = () => this.getProfileData()

  renderProfile = () => {
    const {profile} = this.state
    const {name, profileUrl, shortBio} = profile

    return (
      <div className="profile-container">
        <img src={profileUrl} alt="profile" className="profile-image" />
        <h1 className="name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <>
      <button type="button" className="retry-btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </>
  )

  onClickEmploymentType = event => {
    console.log(event.target.id)
    this.setState(
      {
        checkboxList: event.target.id,
      },
      this.getAllJobsData,
    )
  }

  renderEmploymentType = () => (
    <ul className="employment-type">
      {employmentTypesList.map(each => (
        <li className="checkbox-item" key={each.employmentTypeId}>
          <input
            type="checkbox"
            id={each.employmentTypeId}
            onClick={this.onClickEmploymentType}
          />
          <label className="label" htmlFor={each.employmentTypeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  listenUserInput = event => {
    this.setState({
      userInput: event.target.value,
    })
  }

  getFilterJobs = () => {
    const {userInput, allJobs} = this.state

    const FilterJobs = allJobs.filter(each =>
      each.title.toLowerCase().includes(userInput.toLowerCase()),
    )
    this.setState(
      {
        allJobs: FilterJobs,
      },
      this.getAllJobsData,
    )
  }

  onClickSearchButton = () => {
    this.getAllJobsData()
  }

  onKeyDownEvent = event => {
    console.log(event.key)
    if (event.key === 'Enter') {
      this.getAllJobsData()
    }
  }

  renderSearchBar = () => {
    const {userInput} = this.state

    return (
      <div className="search-con">
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.listenUserInput}
          onKeyDown={this.onKeyDownEvent}
          value={userInput}
        />
        <button
          className="search-btn"
          type="button"
          onClick={this.onClickSearchButton}
        >
          <BiSearch className="search-icon" />
        </button>
      </div>
    )
  }

  onClickSalaryRange = event => {
    // console.log(event.target.id)
    this.setState(
      {
        salary: event.target.id,
      },
      this.getAllJobsData,
    )
  }

  renderSalaryRange = () => (
    <ul className="employment-type">
      {salaryRangesList.map(each => (
        <li className="checkbox-item" key={each.salaryRangeId}>
          <input
            type="radio"
            name="option"
            id={each.salaryRangeId}
            onClick={this.onClickSalaryRange}
          />
          <label className="label" htmlFor={each.salaryRangeId}>
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loaderContainer">
      <Loader type="ThreeDots" color="#4f46e5" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.progress:
        return this.renderLoader()
      case apiStatusConstant.success:
        return this.renderProfile()
      case apiStatusConstant.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  renderAllJobsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.progress:
        return this.renderLoader()
      case apiStatusConstant.success:
        return this.renderAllJobItems()
      case apiStatusConstant.failure:
        return this.renderAllJobItemsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="side-bar">
            <div className="profile-flex-con">{this.renderProfileView()}</div>
            <hr />
            {this.renderEmploymentType()}
            <hr />
            {this.renderSalaryRange()}
          </div>
          <div className="container">
            {this.renderSearchBar()}
            {this.renderAllJobsView()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
