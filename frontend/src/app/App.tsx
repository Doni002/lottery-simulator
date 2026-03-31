import { SimulationContainer } from '../features/simulation/SimulationContainer';
import { MainLayout } from './layouts/MainLayout';

export default function App() {
  return (
    <MainLayout>
      <SimulationContainer />
    </MainLayout>
  );
}
