import { Board } from "./components/Board"
import { Piece } from "./components/Piece"
function App() {
  return (
     <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-neutral-900 text-neutral-100">
      <h1 className="text-3xl font-semibold"> Play Chess </h1>
      <div className="flex gap-4">
  <div className="bg-[#f0d9b5] p-2"><Piece type="k" color="w" /></div>
  <div className="bg-[#b58863] p-2"><Piece type="q" color="b" /></div>
</div>

      <Board/>

     
    </div>
  )
}
export default App

