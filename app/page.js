import Navbar from './components/navbar'; 
import Hero from './components/hero';   
import About from './components/about'; 
import Services from './components/services'; 
import Equipment from './components/equipment';
import Process from './components/process';
import Projects from './components/projects';
import Team from './components/team';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Services/>
      <Equipment/>
      <Process />
      <Projects />
       <Team />

    
    </main>
  );
}