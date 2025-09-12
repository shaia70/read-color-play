import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple test component
const SimpleHome = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>שלי ספרים</h1>
      <p>האפליקציה עובדת!</p>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleHome />} />
        <Route path="*" element={<SimpleHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;