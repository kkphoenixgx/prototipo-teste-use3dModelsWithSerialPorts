import { useState } from "react";
import "./css/App.css";

export const App = () => {

  let [inputValue, setInputValue] = useState("");

  const [collectionAgents, setCollectionAgents] = useState([
    { id: 1, name: "N/A", x: 0, y: 0, z: 0 },
    { id: 2, name: "N/A", x: 0, y: 0, z:0 },
  ]);

  const handleInputChange = (id, field, value) => {
    setCollectionAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id === id ? { ...agent, [field]: parseFloat(value) || 0 } : agent
      )
    );

    console.log(collectionAgents)

  };

  const handleGetCoordenates = () => {
    fetchAgentsFromServer();
  };

  const fetchAgentsFromServer = async () => {
    console.log(`${inputValue}/agents`);
    const fetchAttemption = await fetch(`${inputValue}/agents`);
    if (!fetchAttemption.ok){ console.error("ERRO: erro no get do servidor | valor inválido"); return; }

    let response = await fetchAttemption.json(); 
    
    setCollectionAgents(response)    

  }

  const pushAgentsToServer = async ()=>{
    console.log(`${inputValue}/changePosition`);
    
    try {
      console.log(JSON.stringify(collectionAgents));
      
      const response = await fetch( `${inputValue}/changePosition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo
        },
        body: JSON.stringify(collectionAgents), // Envia o array todo como JSON
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Posição dos agentes atualizada com sucesso:', data);
      } else {
        console.error('Erro ao atualizar as posições dos agentes:', response.statusText);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  }


  return (
    <div className="App">

      <input type="text" onChange={(event) => {
          setInputValue(event.target.value);
        }} value={inputValue} placeholder="Digite o endereço" ></input>


      <table>
        <caption>Agentes</caption>

        <thead>
          <tr>
            <th scope="col">Agentes</th>
            <th scope="col">X</th>
            <th scope="col">Y</th>
            <th scope="col">Z</th>
          </tr>
        </thead>

        <tbody>
          {collectionAgents.map((agent) => (
            <tr key={agent.id}>
              <th scope="row">{agent.name}</th>
              <td>
                <input
                  type="number"
                  value={agent.x}
                  onChange={(e) =>
                    handleInputChange(agent.id, "x", e.target.value)
                  }
                  style={{ width: "80px", textAlign: "right" }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={agent.y}
                  onChange={(e) =>
                    handleInputChange(agent.id, "y", e.target.value)
                  }
                  style={{ width: "80px", textAlign: "right" }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={agent.z}
                  onChange={(e) =>
                    handleInputChange(agent.id, "z", e.target.value)
                  }
                  style={{ width: "80px", textAlign: "right" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="container-buttons" >
        <button onClick={handleGetCoordenates}>Get Coordinates</button>
        <button onClick={pushAgentsToServer} >Send coordinates</button>
      </div>


    </div>
  );
};
