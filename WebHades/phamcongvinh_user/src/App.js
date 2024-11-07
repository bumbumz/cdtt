import React from 'react';
import './App.css';
import Main from './component/Main';
import Footer from './component/Footer';
import Headerr from './component/Headerr';

function App() {
  return (
    <div className="">
      <Headerr />
      <div className="flex-col min-h-screen ">
        <Main />
      </div>
      <Footer />
    </div>
  );
}

export default App;
