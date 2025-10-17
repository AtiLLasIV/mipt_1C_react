import data from "./assets/mock_data.json";
import Card from "./components/Card";
import "./App.css";

function App() {
  return (
    <div className="box">
      {data.map((post, id) => (
        <Card key={id} post={post}/>
      ))}
    </div>
  );
}

export default App;
