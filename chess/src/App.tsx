import { Board } from "./components/Board"

function App() {
  return (
     <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-neutral-900 text-neutral-100">
      <h1 className="text-3xl font-semibold"> Play Chess </h1>
      <Board/>

     
    </div>
  )
}
export default App

