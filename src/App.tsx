import reactLogo from './assets/react.svg'
import './App.css'

type Props = {
  message: string;
}
function App(props: Props) {

  return (
    <div>
      <input />
      <img src={reactLogo} alt="" />
      <p>{props.message}</p>
    </div>
  )
}

export default App
