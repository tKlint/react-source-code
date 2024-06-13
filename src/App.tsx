import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type Props = {
  message: string;
}
function App(props: Props) {

  return (
    <div>
      <img src={reactLogo} alt="" />
      <img src={viteLogo} alt="" />
      <p>{props.message}</p>
    </div>
  )
}

export default App
