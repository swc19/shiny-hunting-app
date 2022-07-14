import './shiny-hunting-app.css';
import { useEffect, useState } from 'react';

function ShinyHuntingApp() {

  const [dex, setDex] = useState([]);
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem('current');
    return saved ? JSON.parse(saved) : "";
  });
  const [filteredDex, setFilteredDex] = useState([]);
  let [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count');
    return saved ? JSON.parse(saved) : 0;
  });
  const [shiny, setShiny] = useState(false);

  async function getDex(){
    const dex = await fetch('./pokedex.json',);
    const dexJson = await dex.json();

    Object.values(dexJson).forEach(element => {
      // Clean up special characters to more easily get their image

      // Perceived name is backend name, latter is displayed
      element.name.perceived_name = element.name.english;
      // Nidorans
      element.name.perceived_name = element.name.perceived_name.replace("♂", "M");
      element.name.perceived_name = element.name.perceived_name.replace("♀", "F");
      // Far/Sirfetch'd
      element.name.perceived_name = element.name.perceived_name.replace(/'/g, '');
      // Type: Null
      element.name.perceived_name = element.name.perceived_name.replace(': ', '');
      // Mimes
      element.name.perceived_name = element.name.perceived_name.replace('.', '');
      element.name.perceived_name = element.name.perceived_name.replace(' ', '');
      
      // Jangmo-o line
      if(element.name.perceived_name.includes("mo-o")){
        element.name.perceived_name = element.name.perceived_name.replace("-", "");
      }
    });

    setDex(dexJson);
    setFilteredDex(dexJson);
  }

  useEffect(() => {
    getDex()
  }, [])

  useEffect(() => {
    localStorage.setItem('current', JSON.stringify(current));
  }, [current])
  
  useEffect(() => {
    localStorage.setItem('count', JSON.stringify(count));
  }, [count])


  return (
    <div className="body">
      <div className='dex-container'>
        <input type="text" placeholder="Search" onChange={(e) => {
          setFilteredDex(dex.filter(pokemon => pokemon.name.english.toLowerCase().includes(e.target.value.toLowerCase())))
        } } />
        <div className='dex-list'>
          {filteredDex.map(pokemon => {
            return (<div className='pokemon-card' key={pokemon.id} value={pokemon.name.english} onClick={() => setCurrent(pokemon.name.perceived_name)}>
              {pokemon.name.english}
              </div>)
          })}
          </div>
      </div>
      
      <div className='counter-container'>
        <div className='counter'>
          {current ?  
            <div className='pokemon-image'> 
              <img src={`https://play.pokemonshowdown.com/sprites/ani-shiny/${current.toLowerCase()}.gif`} alt={current}/>   
            </div>  
          : null}
          <h1 className={shiny ? 'counter-number rainbow' : 'counter-number'}>{count}</h1>
        </div>
        <div className='counter-buttons'>
          <button className={count ? '' : "disabled"} onClick={() => setCount(count-1)}>-1</button>
          <button onClick={() => setCount(count+1)}>+1</button>
          <button onClick={() => {setCount(0); setShiny(false)}}>Reset</button>
          <button onClick={() => setShiny(!shiny)}>{shiny ? 'Unshiny' : 'Shiny'}</button>
        </div>
      </div>
        
      
      <div className='credit'>
        <p>Made by swc19</p>
        <a href="https://twitter.com/itsSdubs">Twitter</a>
        <a href="https://twitch.tv/swc19">Twitch</a>
        <a href="https://github.com/swc19">GitHub</a>
      </div>
    </div>
  );
}
export default ShinyHuntingApp;
