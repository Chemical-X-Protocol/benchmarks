import React from 'react';

export const App: React.FC = () => {
  return (
    <div data-testid="benchmark-harness-root">
      <h1>Chemical X Benchmarks Test Harness</h1>
      <p>Select an architectural target branch (base/monolith or base/chemical-x) to evaluate.</p>
    </div>
  );
};

export default App;
