import './shiny-hunting-app.css';
import { useEffect, useState } from 'react';

function ShinyHuntingApp() {

  const [dex, setDex] = useState([]);
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem('current');
    console.log(typeof saved)
    try{
      return JSON.parse(saved);
    } catch {
      return "";
    }
  });
  const [filteredDex, setFilteredDex] = useState([]);
  let [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count');
    return saved ? JSON.parse(saved) : 0;
  });
  const [shiny, setShiny] = useState(false);

  async function getDex(){
    //const dex = await fetch('./pokedex.json',);
    const dex = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1130&offset=0')
    let dexJson = await dex.json();
    dexJson = dexJson.results;

    const updated_dex = processDex(dexJson);
    setDex(updated_dex);
    setFilteredDex(updated_dex);
  }

  function processDex(dex){

    function splitType(element, paren){
      const name = element.name.split("-")[1];
      let constructed_string;
      element.name = element.name.replace("-", " ");
      if(paren){
        constructed_string = ` (${upcase(name)})`;
      } else {
        constructed_string = ` ${upcase(name)}`;
      }
      element.name = element.name.replace(name, constructed_string);
    }

    function upcase(str){
      try{
        return str.charAt(0).toUpperCase() + str.slice(1);
      } catch {
        return;
      }
    }

    for(let i=0; i<dex.length; i++){
      const element = dex[i];
      // Clean up special characters to more easily get their image
      // Perceived name is backend name, latter is displayed
      element.perceived_name = element.name;
      const to_remove = ["totem", "super", "large", "small", "kleavor", "enamorus", "overqwil", "ursaluna", "wyrdeer", "sneasler", "basculegion", "power-construct",
                          "world", "partner", "starter", "battle-bond", "own-tempo", ]
      if(to_remove.findIndex(arrayelement => element.name.includes(arrayelement)) >= 0 || (element.name.includes("minior") && !element.name.includes("red"))){
        dex.splice(i, 1);
        i--;
        continue;
      }
      
      
      // Nidorans
      if(element.name.includes("nidoran")){
        element.perceived_name = element.perceived_name.replace("-m", "m");
        element.perceived_name = element.perceived_name.replace("-f", "f");
      }
      if(element.name.includes("indeedee")){
        element.perceived_name = element.perceived_name.replace("-female", "-f");
        element.perceived_name = element.perceived_name.replace("-male", "");
      }

      // Wormadam plant
      element.perceived_name = element.perceived_name.replace('-plant', '');
      // Deoxys normal
      element.perceived_name = element.perceived_name.replace('-normal', '');
      // Jangmo-o line
      if(element.perceived_name.includes("mo-o")){
        element.perceived_name = element.perceived_name.replace("-", "");
      }
      // Weather trio
      element.perceived_name = element.perceived_name.replace("-incarnate", "");

      // Shaymin land
      element.perceived_name = element.perceived_name.replace("-land", "");

      // Pika Caps
      element.perceived_name = element.perceived_name.replace("-cap", "cap");

      // Default Minior
      element.perceived_name = element.perceived_name.replace("-red", "");

      // Aegislash
      element.perceived_name = element.perceived_name.replace("-shield", "");

      // Toxtricity
      element.perceived_name = element.perceived_name.replace("-amped", "");
      element.perceived_name = element.perceived_name.replace("-low-key", "-lowkey");

      // Meloetta
      element.perceived_name = element.perceived_name.replace("-aria", "");

      // Giratina
      element.perceived_name = element.perceived_name.replace("-altered", "");

      // Basculin
      element.perceived_name = element.perceived_name.replace("-blue", "-bluestriped");
      element.perceived_name = element.perceived_name.replace("-striped", "");

      // Darmanitan
      element.perceived_name = element.perceived_name.replace("-standard", "");
      element.perceived_name = element.perceived_name.replace("-galar-standard", "-galar");
      element.perceived_name = element.perceived_name.replace("-galar-zen", "-galarzen");

      // Keldeo
      element.perceived_name = element.perceived_name.replace("-ordinary", "");

      // Meowstic
      element.perceived_name = element.perceived_name.replace("-male", "");
      element.perceived_name = element.perceived_name.replace("-female", "-f");

      // Pumpkaboo line
      element.perceived_name = element.perceived_name.replace("-average", "");

      // Zygarde
      element.perceived_name = element.perceived_name.replace("-50", "");

      // Oricorio
      element.perceived_name = element.perceived_name.replace("-baile", "");
      element.perceived_name = element.perceived_name.replace("-pom-pom", "-pompom");

      // Lycanroc
      element.perceived_name = element.perceived_name.replace("-midday", "");

      // Wishiwashi
      element.perceived_name = element.perceived_name.replace("-solo", "");

      // Type: Null
      element.perceived_name = element.perceived_name.replace('-null', 'null');

      // Mimikyu
      element.perceived_name = element.perceived_name.replace("-disguised", "");

      // Mimes
      element.perceived_name = element.perceived_name.replace('-jr', 'jr');
      element.perceived_name = element.perceived_name.replace('-mime', 'mime');
      element.perceived_name = element.perceived_name.replace('-rime', 'rime');

      // Morpeko
      element.perceived_name = element.perceived_name.replace("-full-belly", "");

      // Eiscue
      if(element.perceived_name.includes("eiscue")){
        element.perceived_name = element.perceived_name.replace("-ice", "");
      }

      // Urshifu line
      element.perceived_name = element.perceived_name.replace("-single-strike", "");
      element.perceived_name = element.perceived_name.replace("-rapid-strike", "-rapidstrike");

      // Pikachus
      element.perceived_name = element.perceived_name.replace("-rock-star", "-rockstar");
      element.perceived_name = element.perceived_name.replace("-pop-star", "-popstar");
      element.perceived_name = element.perceived_name.replace("-originalcap", "-kantocap");

      // Necrozma
      element.perceived_name = element.perceived_name.replace("-dusk", "-duskmane");
      element.perceived_name = element.perceived_name.replace("-dawn", "-dawnwings");

      // Now change frontend names to be nicer
      
      element.name = upcase(element.name)

      element.name = element.name.replace("-alola", " (Alola)");
      element.name = element.name.replace("-galar", " (Galar)");
      element.name = element.name.replace("-mega-x", " (Mega X)");
      element.name = element.name.replace("-mega-y", " (Mega Y)");
      element.name = element.name.replace("-mega", " (Mega)");
      element.name = element.name.replace("-gmax", " (Gmax)");
      element.name = element.name.replace("-therian", " (Therian)");
      element.name = element.name.replace("-primal", " (Primal)");
      element.name = element.name.replace("-incarnate", " (Incarnate)");
      element.name = element.name.replace("-altered", " (Altered)");
      element.name = element.name.replace("-normal", "");
      element.name = element.name.replace("-meteor", " (Meteor)");
      element.name = element.name.replace("-amped", "");
      element.name = element.name.replace("-low-key", " (Low Key)");
      element.name = element.name.replace("-striped", "");
      element.name = element.name.replace("-standard", "");
      element.name = element.name.replace("-zen", " (Zen)");
      element.name = element.name.replace("-average", "");
      element.name = element.name.replace("-pom-pom", "-pompom");
      element.name = element.name.replace("-null", ": Null");
      element.name = element.name.replace("-disguised", "");
      element.name = element.name.replace("-busted", " (Busted)");
      element.name = element.name.replace("Mr-mime", "Mr. Mime");
      element.name = element.name.replace("Mr-rime", "Mr. Rime");
      element.name = element.name.replace("Mime-jr", "Mime Jr.");
      element.name = element.name.replace("-full-belly", "");
      element.name = element.name.replace("-hangry", " (Hangry)");
      element.name = element.name.replace("-single-strike", "-single Strike");
      element.name = element.name.replace("-rapid-strike", "-rapid Strike");
      element.name = element.name.replace("-rock-star", "-rock Star");
      element.name = element.name.replace("-pop-star", "-pop Star");
      element.name = element.name.replace("-original-cap", "-kanto");
      element.name = element.name.replace("-cap", "");
      element.name = element.name.replace("-origin", " (Origin)");
      element.name = element.name.replace("-eternal", "");
      element.name = element.name.replace("-ash", " (Ash)");
      element.name = element.name.replace("-unbound", " (Unbound)");
      element.name = element.name.replace("-crowned", " (Crowned)");
      element.name = element.name.replace("-eternamax", " (Eternamax)");
      element.name = element.name.replace("-dada", " (Dada)");
      element.name = element.name.replace("chd", "ch'd");

      const paren = ["Wormadam", "Shaymin", "Deoxys", "Rotom", "Castform", "Meloetta", "Minior", "Basculin", "Keldeo", "Aegislash", "Meowstic", "Zygarde",
                      "Oricorio", "Lycanroc", "Eiscue", "Kyurem", "Urshifu", "Pikachu", "Necrozma", "Cramorant", "Calyrex"]
      if(paren.findIndex(arrayelement => element.name.includes(arrayelement)) >= 0){
        splitType(element, true);
      }
      const no_paren = ["Tapu", "Wishiwashi", "Nidoran", "Indeedee"]
      if(no_paren.findIndex(arrayelement => element.name.includes(arrayelement)) >= 0){
        splitType(element, false);
      }
    };
    return dex;
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
          setFilteredDex(dex.filter(pokemon => pokemon.name.toLowerCase().includes(e.target.value.toLowerCase())))
        } } />
        <div className='dex-list'>
          {filteredDex.map(pokemon => {
            return (<div className='pokemon-card' key={pokemon.id} value={pokemon.name} onClick={() => setCurrent(pokemon.perceived_name)}>
              {pokemon.name}
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
