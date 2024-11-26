import { ChatRoom } from './components/ChatRoom';

function App() {
  return (
    <div className="App">
      <h1>Chiikawa Chat</h1>
      <ChatRoom isAdmin={true} />
    </div>
  );
}

export default App; 