import React from '../lib/react/React'


export default class Home extends React.Component {
  
  render(): React.ReactNode {
    return (
      <div>
        hello world
        <p>{this.props.message}</p>
      </div>
    )
  }
}