import { Routes, Route } from 'react-router-dom';
import ClientRegistration from './pages';
import IndividualClientRegistration from './pages/IndividualClientRegistration';
import CompanyClientRegistration from './pages/CompanyClientRegistration';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<ClientRegistration />} />
        <Route path="individual" element={<IndividualClientRegistration />} />
        <Route path="company" element={<CompanyClientRegistration />} />
      </Route>
    </Routes>
  );
}

export default App;
