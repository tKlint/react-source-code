// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )


import ReactDOM2 from '../lib/react-dom/ReactDOM'

ReactDOM2.createRoot(document.getElementById('root')!).render(
  <div className="hello" onClick={() => {
    console.log('222')
  }}>
    <p>
      <span>232</span>
      <span>232</span>
    </p>
    <div>222</div>
  </div>
)
