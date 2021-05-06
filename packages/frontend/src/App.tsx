import React from 'react'
import logo from './logo.svg'
import './App.css'
import { graphql } from 'babel-plugin-relay/macro'
import RelayEnvironment from './RelayEnvironment'
import { loadQuery, usePreloadedQuery } from 'react-relay/hooks'
import { AppQuery } from './__generated__/AppQuery.graphql'

const TestQuery = graphql`
  query AppQuery {
    anotherTestEntity {
      id
    }
  }
`

const preloadedQuery = loadQuery<AppQuery>(RelayEnvironment, TestQuery, {
  /* query variables */
})

function App() {
  const data = usePreloadedQuery<AppQuery>(TestQuery, preloadedQuery)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{data.anotherTestEntity.id}</p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
