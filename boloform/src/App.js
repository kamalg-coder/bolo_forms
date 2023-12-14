import './App.css';
import { Route, Routes } from 'react-router-dom';
import AddForm from './Pages/Form';
import Preview from './Pages/Preview';
import Home from './Pages/Home';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/form/:action' element={<AddForm/>}/>
      <Route path='/View/:id' element={<Preview/>}/>
    </Routes>
  );
}

export default App;

