import React from 'react'
import { graphql } from 'react-apollo'
import Votes from './Votes'
import { flyingHearts, DEFAULT_PROFILE_PIC } from '../utils/helpers'
import TimeAgo from 'react-timeago'
import TweetParser from './TweetParser'

import CREATE_VOTE_MUTATION from '../graphql/Vote.mutation.gql'

require('smoothscroll-polyfill').polyfill()

class Question extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      votes: this.props.question._votesMeta.count,
    }
  }

  componentDidMount() {
    // not working for now
    // window.scroll({ top: this.elem.scrollHeight, left: 0, behavior: 'smooth' })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.question && this.props.question &&
      nextProps.question._votesMeta.count !== this.props.question._votesMeta.count) {
      this.setState({
        votes: nextProps.question._votesMeta.count,
      })
    }
  }

  formatter(value, unit, suffix, date, defaultFormatter) {
    if (unit === 'second' && value < 60) {
      return 'just now'
    }
    return defaultFormatter(value, unit, suffix, date)
  }

  onSubmit() {
    this.setState({
      votes: this.state.votes+1,
    })
    this.props.vote(this.props.question.id)
    flyingHearts('.flying-hearts')
  }

  render() {
    return (
      <li>
        <div className='row' ref={elem => (this.elem = elem)}>
          <div className='col-md-11'>
            <div className='text-body'>
              <TweetParser parseUsers={false} parseUrls={false} hashtagClass={'twitter'} userClass={'twitter'} >{this.props.question.body}</TweetParser></div>
            <Votes votes={this.state.votes} />
            <div className='profile-container'>
              <div className='profile-small'>
                <img src={this.props.question.user &&this.props.question.user.pictureUrl || DEFAULT_PROFILE_PIC} />
              </div>
              <div className='profile-small-text'>by {this.props.question.user? this.props.question.user.username : '@happylama'}
                <span className='hidden-xs'>, <TimeAgo date={this.props.question.createdAt} formatter={this.formatter} />
                </span>
              </div>
            </div>
          </div>
          <div className='col-md-1'>
            <div className='vote'>
              <button className='btn btn-circle'
                onClick={e => this.onSubmit()}>
                <i className='fa fa-heart' />
              </button>
            </div>
          </div>
        </div>
      </li>
    )
  }
}

const withVote = graphql(CREATE_VOTE_MUTATION,
  {
    props: ({ ownProps, mutate }) => ({
      vote(id) {
        return mutate({
          variables: { question: id },
        })
      },
    }),
  },
)

Question.propTypes = {
  question: React.PropTypes.object.isRequired,
}

export default withVote(Question)