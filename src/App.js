import { useState } from "react";
import { MultiSelect } from "./components/MultiSelect";

function App() {
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?name=${searchText}`);
      if (!response.ok) {
        setCharacters([]);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const simplifiedData = data.results.map(character => ({
        id: character.id,
        label: character.name,
        image: character.image,
        desc: `${character.episode.length} Episodes`
      }));
      setCharacters(simplifiedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <MultiSelect
        fetchData={fetchData}
        options={characters}
        value={selectedCharacters}
        setValue={setSelectedCharacters}
        loading={loading}
        searchText={searchText}
        setSearchText={setSearchText}
      />
    </div>
  );
}

export default App;
