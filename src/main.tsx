import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const strictMode = false;
const Root = strictMode 
  ? React.StrictMode
  : React.Fragment
;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Root>
    <App />
  </Root>,
)
