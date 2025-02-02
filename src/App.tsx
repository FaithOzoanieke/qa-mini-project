import { Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import ItemList from "./components/ItemList"; 
import ItemForm from "./components/ItemForm";
import ItemDetails from "./components/ItemDetails";
import EditItem from "./components/EditItem";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/items" element={<ItemList />} />
      <Route path="/create-item" element={<ItemForm />} />
      <Route path="/items/:id" element={<ItemDetails />} />
      <Route path="/edit-item/:id" element={<EditItem />} />
    </Routes>
  );
}

export default App;
