/* eslint-disable jsx-a11y/anchor-is-valid */
import "bulma/css/bulma.min.css";
import "./App.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaRegTrashCan } from "react-icons/fa6";

const APP_NAME = "io.tgjohns.todos";
const API_KEY = `${APP_NAME}.API_KEY`;
const LIST_KEY = ".lists";

function App() {
  /* State */
  const defaultState = [
    {
      name: "To-Do",
      todos: [],
    },
    {
      name: "Done",
      todos: [],
    },
  ];

  const [lists, setLists] = useState(defaultState);

  if (!localStorage.getItem(API_KEY)) {
    localStorage.setItem(API_KEY, APP_NAME + "." + uuidv4());
    localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(defaultState));
  }

  useEffect(() => {
    if (localStorage.getItem(API_KEY)) {
      // Persist local storage
      const lists = JSON.parse(localStorage.getItem(APP_NAME + LIST_KEY));
      setLists(lists);
    }
  }, []);

  const [listIndex, setListIndex] = useState(0);

  const [todo, setTodo] = useState("");

  /* Utility functions */
  const goToNextList = (todo) => {
    if (listIndex + 1 === lists.length) return;

    lists[listIndex].todos = lists[listIndex].todos.filter(
      (t) => t.id !== todo.id
    );
    lists[listIndex + 1].todos.unshift(todo);
    setLists([...lists]);
    localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(lists));
  };

  const onAddTodo = () => {
    if (!todo) return;

    const _data = {
      id: uuidv4(),
      description: todo,
    };

    lists[listIndex].todos.push(_data);
    setTodo("");
    localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(lists));
  };

  const removeTodo = (todo) => {
    lists[listIndex].todos = lists[listIndex].todos.filter(
      (t) => t.id !== todo.id
    );
    setLists([...lists]);
    localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(lists));
  };

  const archiveTodos = () => {
    lists[lists.length - 1].todos = [];
    setLists([...lists]);
    localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(lists));
  };

  /* Settings */
  const iconSize = 20;
  const onFinalList = listIndex + 1 === lists.length;

  /* Permissions */
  const canAddTodo = listIndex === 0;
  const canDisplayArchiveTodos =
    listIndex + 1 === lists.length && lists[listIndex].todos.length > 0;

  /* Display helper functions */
  const displayListHeading = lists.map((list, index) => (
    <a
      href="#"
      className={index === listIndex ? "is-active" : ""}
      onClick={() => {
        setListIndex(index);
      }}
      key={index}
    >
      {list.name}
    </a>
  ));

  const displayTodos = lists[listIndex].todos.map((todo) => {
    return (
      <a className="panel-block is-block" key={todo.id}>
        <div className="level">
          <div className="todo-left" onClick={() => goToNextList(todo)}>
            <p className={"" + (onFinalList ? "complete" : "")}>
              {todo.description}
            </p>
          </div>
          <div className="todo-right">
            {!onFinalList && (
              <p className="" onClick={() => removeTodo(todo)}>
                <FaRegTrashCan size={iconSize} />
              </p>
            )}
          </div>
        </div>
      </a>
    );
  });

  const displayAddTodo = (
    <div className="panel-block">
      <div className="control">
        <input
          type="text"
          className="input"
          name="todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <div className="mt-3"></div>
        <button
          disabled={!todo}
          onClick={onAddTodo}
          className="button is-link is-outlined is-fullwidth"
        >
          Add
        </button>
      </div>
    </div>
  );

  const displayArchiveTodos = (
    <div className="panel-block">
      <div className="control">
        <button
          disabled={lists[lists.length - 1].todos.length < 1}
          onClick={archiveTodos}
          className="button is-link is-outlined is-fullwidth"
        >
          Archive
        </button>
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="panel is-info">
        <p className="panel-heading">{new Date().toDateString()}</p>
        <p className="panel-tabs">{displayListHeading}</p>
        {displayTodos}
        {canAddTodo && displayAddTodo}
        {canDisplayArchiveTodos && displayArchiveTodos}
      </div>
    </div>
  );
}

export default App;
