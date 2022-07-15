import './shiny-hunting-app.css';
import { useEffect, useState } from 'react';

function ShinyHuntingApp() {

  const [filteredDex, setFilteredDex] = useState([]);
  const [dex, setDex] = useState(() => {
    const dex = localStorage.getItem('dex');
    if(dex){
      setFilteredDex(JSON.parse(dex));
      return JSON.parse(dex);
    } else {
      getDex();
    };
  });
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem('current');
    try{
      return JSON.parse(saved);
    } catch {
      return "";
    }
  });
  
  let [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count');
    return saved ? JSON.parse(saved) : 0;
  });
  const [shiny, setShiny] = useState(false);

  async function getDex(){
    const dex = await fetch(
      "https://beta.pokeapi.co/graphql/v1beta",
      {
        method: "POST",
        body: JSON.stringify({
          query: `
          query query {
            pokemon_v2_pokemon {
              id
              name
              pokemon_v2_pokemonspecy {
                capture_rate
              }
            }
          }`,
          operationName: "query"
        })
      }
    )
    let dexJson = await dex.json();
    dexJson = dexJson.data.pokemon_v2_pokemon;

    const updated_dex = processDex(dexJson);
    setDex(updated_dex);
    localStorage.setItem('dex', JSON.stringify(updated_dex));
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
      
      const to_replace_perceived = {
        "-plant": "", // Wormadam
        "-normal": "", //  Deoxys
        "-incarnate": "", // Weather trio
        "-land": "", // Shaymin
        "-cap": "cap",
        "-red": "", // Minior
        "-shield": "", // Aegislash
        "-amped": "", // Toxtricity
        "-low-key": "-lowkey",
        "-aria": "", // Meloetta
        "-altered": "", // Giratina
        "-blue": "-bluestriped", // Basculin
        "-striped": "",
        "-standard": "", // Darmanitan
        "-galar-standard": "-galar",
        "-galar-zen": "-galarzen",
        "-ordinary": "", // Keldeo
        "-male": "", // Indeedee + Meowstic
        "-female": "-f",
        "-average": "", // Pumpkaboo line
        "-50": "", // Zygarde
        "-baile": "", // Oricorio
        "-pom-pom": "-pompom",
        "-midday": "", // Lycanroc
        "-solo": "", // Wishiwashi
        "-null": "null", // Type: Null
        "-disguised": "", //  Mimikyu
        "-jr": "jr", // Mimes
        "-mime": "mime",
        "-rime": "rime",
        "-full-belly": "", // Morpeko
        "-single-strike": "", // Urshifu
        "-rapid-strike": "-rapidstrike",
        "-rock-star": "-rockstar", // Pikachus
        "-pop-star": "-popstar",
        "-originalcap": "-kantocap",
      }
      Object.entries(to_replace_perceived).forEach(([key, value]) => {
        element.perceived_name = element.perceived_name.replace(key, value);
      });
      // Nidorans
      if(element.name.includes("nidoran")){
        element.perceived_name = element.perceived_name.replace("-m", "m").replace("-f", "f");
      }
      // Jangmo-o line
      if(element.perceived_name.includes("mo-o")){
        element.perceived_name = element.perceived_name.replace("-", "");
      }
      // Eiscue
      if(element.perceived_name.includes("eiscue")){
        element.perceived_name = element.perceived_name.replace("-ice", "");
      }
      // Necrozma Dusk
      if(element.perceived_name.includes("necrozma")){
        element.perceived_name = element.perceived_name.replace("-dusk", "-duskmane").replace("-dawn", "-dawnwings");
      }

      // Now change frontend names to be nicer
      
      element.name = upcase(element.name)

      const to_replace_name = {
        "-alola": " (Alola)", // Alolan forms
        "-galar": " (Galar)", // Galarian forms
        "-mega-x": " (Mega X)", // Mega M2/Charizard
        "-mega-y": " (Mega Y)",
        "-mega": " (Mega)", // Megas
        "-gmax": " (Gmax)", // GMaxes
        "-therian": " (Therian)", // Weather Trio
        "-incarnate": " (Incarnate)",
        "-primal": " (Primal)", // Groudon/Kyogre
        "-original": " (Original)", // Magearna
        "-origin": " (Origin)", // Giratina
        "-altered": " (Altered)", 
        "-normal": "", // Deoxys
        "-meteor": " (Meteor)", // Minior
        "-amped": "", // Toxtricity
        "-low-key": " (Low Key)",
        "-striped": "", // Basculin
        "-standard": "", // Darmanitan
        "-zen": " (Zen)",
        "-average": "", // Pumpkaboo line
        "-pom-pom": "-pompom", // Oricorio
        "-null": " Null", // Type: Null
        "-disguised": "", //  Mimikyu
        "-busted": " (Busted)", 
        "Mr-mime": "Mr. Mime", // Mimes
        "Mr-rime": "Mr. Rime",
        "Mime-jr": "Mime Jr.",
        "-full-belly": "", // Morpeko
        "-hangry": " (Hangry)",
        "-single-strike": "-single Strike", // Urshifu
        "-rapid-strike": "-rapid Strike",
        "-rock-star": "-rock Star", // Pikachus
        "-pop-star": "-pop Star",
        "-original-cap": "-kanto Cap",
        "-cap": "",
        "-eternal": "", // Floette
        "-ash": " (Ash)", // Greninja
        "-unbound": " (Unbound)", // Hoopa
        "-crowned": " (Crowned)", // Zacian/Zamazenta
        "-eternamax": " (Eternamax)", // Eternatus
        "-dada": " (Dada)", // Zarude
        "chd": "ch'd", // Farfetch'd line
      }


      Object.entries(to_replace_name).forEach(([key, value]) => {
        element.name = element.name.replace(key, value);
      });
    

      const paren = ["Wormadam", "Shaymin", "Deoxys", "Rotom", "Castform", "Meloetta", "Minior", "Basculin", "Keldeo", "Aegislash", "Meowstic", "Zygarde",
                      "Oricorio", "Lycanroc", "Eiscue", "Kyurem", "Urshifu", "Pikachu", "Necrozma", "Cramorant", "Calyrex", "Indeedee"]
      if(paren.findIndex(arrayelement => element.name.includes(arrayelement)) >= 0){
        splitType(element, true);
      }
      const no_paren = ["Tapu", "Wishiwashi", "Nidoran"]
      if(no_paren.findIndex(arrayelement => element.name.includes(arrayelement)) >= 0){
        splitType(element, false);
      }
    };
    return dex;
  }

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
        <div className='capture-rate'>
          {(current && dex) ? `Capture Rate: ${(dex.find(pokemon => pokemon.perceived_name === current).pokemon_v2_pokemonspecy.capture_rate)}` : null}
        </div>
        <div className='counter-buttons'>
          <button className={count ? '' : "disabled"} onClick={() => setCount(count-1)}>-1</button>
          <button onClick={() => setCount(count+1)}>+1</button>
          <button onClick={() => {setCount(0); setShiny(false)}}>Reset</button>
          <button onClick={() => setShiny(!shiny)}>{shiny ? 'Unshiny' : 'Shiny'}</button>
          <button onClick={() => getDex()}>Refresh</button>
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
