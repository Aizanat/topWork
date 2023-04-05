import React from 'react'
import ReactDOM from 'react-dom'
import FormComponent from './FormComponent'
import See from './See'

class App extends React.Component {
  render() {
    return (
      <div className="ui masthead vertical segment">
        <FormComponent />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'))
