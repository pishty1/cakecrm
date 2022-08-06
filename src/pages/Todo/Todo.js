import { useState } from "react";
import api from "../../api/api";
import {useGetTodos } from "../../hooks";
import { Server } from "../../utils/config";
import Alert from "../Alert/Alert";
import TodoItem from "./TodoItem";

const Todo = ({ user, dispatch }) => {
  const [stale, setStale] = useState({ stale: false });
  const [{ todos, isLoading, isError }] = useGetTodos(stale);
  const [currentTodo, setCurrentTodo] = useState("");

  const handleAddTodo = async (e) => {
    e.preventDefault();
    console.log("Adding Todo");
    const data = {
      content: currentTodo,
      isComplete: false,
    };
    console.log(data, user);
    try {
      await api.createDocument(
        Server.collectionID,
        data,
        [`user:${user["$id"]}`],
        [`user:${user["$id"]}`]
      );
      setStale({ stale: true });
      setCurrentTodo("");
    } catch (e) {
      console.log("Error in adding todo");
    }
  };

  return (
    <>
      <section className="container h-screen max-h-screen px-3 max-w-2xl mx-auto flex flex-col">
        {isError && <Alert color="red" message="Something went wrong..." />}
        <div className="my-auto p-16 rounded-lg text-center">
          <div className="font-bold text-3xl md:text-5xl lg:text-6xl">
            🍰 cakeCrm<br /> &nbsp; 
          </div>
          <div className="text-1xl md:text-3xl lg:text-3xl">
            Hi {user["name"]}   
          </div>

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="w-full my-8 px-6 py-4 text-xl rounded-lg border-0 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md"
              placeholder="🤔   What to do today?"
              value={currentTodo}
              onChange={(e) => setCurrentTodo(e.target.value)}
            ></input>
          </form>

          {isLoading && <h1> Loading .... </h1>}

          <ul>
            {todos.map((item) => (
              <TodoItem key={item["$id"]} item={item} setStale={setStale} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Todo;
