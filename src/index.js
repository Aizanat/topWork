import React from 'react'
import ReactDOM from 'react-dom'
import Login from './pages/Login'

class App extends React.Component {
  render() {
    return (
      <div className="ui masthead vertical segment">
        <Login />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('#root'))

// Я так понимаю что Amplify.configure, oauth, useEffect должен использоваться только в компоненте Login ?? Я вписала его во всех компонентах, только вопрос, правильно ли это)

//Здесь я сделала основным компонент Login, после будет переходить по клику на другие

//FormComponent пусть пока будет как шпаргалка
