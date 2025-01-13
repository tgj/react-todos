/* eslint-disable jsx-a11y/anchor-is-valid */
import "bulma/css/bulma.min.css";
import "./App.css";
import { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaRegTrashCan } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";

const APP_NAME = "io.tgjohns.todos";
const API_KEY = `${APP_NAME}.API_KEY`;
const LIST_KEY = ".lists";
const VERSION_KEY = ".version";
const VERSION = "0.0.0";

function App() {
  /* State */
  const defaultListId = "default";
  const defaultState = useMemo(
    () => [
      {
        id: defaultListId,
        name: "To-Do",
        lists: [
          {
            name: "To-Do",
            todos: [],
          },
          {
            name: "Done",
            todos: [],
          },
        ],
      },
    ],
    []
  );

  const [lists, setLists] = useState(defaultState);

  const [currentListId, setCurrentListId] = useState(defaultListId);

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

  useMemo(() => {
    if (!localStorage.getItem(APP_NAME + VERSION_KEY)) {
      setLists([...defaultState]);
      setCurrentListId(defaultListId);
      localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(defaultState));
      localStorage.setItem(APP_NAME + VERSION_KEY, VERSION);
    }
  }, [defaultState]);

  const [listIndex, setListIndex] = useState(0);

  const [todo, setTodo] = useState("");

  const [listSelectDropdown, setListSelectDropdown] = useState(false);

  const getCurrentList = () => lists.find((list) => list.id === currentListId);

  /* Utility functions */
  const goToNextList = (todo) => {
    const list = getCurrentList();
    if (listIndex + 1 === list.lists.length) return;

    list.lists[listIndex].todos = list.lists[listIndex].todos.filter(
      (t) => t.id !== todo.id
    );
    list.lists[listIndex + 1].todos.unshift(todo);
    setLists([...lists]);
    localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(lists));
  };

  const onAddTodo = () => {
    if (!todo) return;

    const _data = {
      id: uuidv4(),
      description: todo,
    };

    getCurrentList().lists[listIndex].todos.push(_data);
    setTodo("");
    localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(lists));
  };

  const removeTodo = (todo) => {
    const list = getCurrentList();
    list.lists[listIndex].todos = list.lists[listIndex].todos.filter(
      (t) => t.id !== todo.id
    );
    setLists([...lists]);
    localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(lists));
  };

  const archiveTodos = () => {
    const list = getCurrentList();
    list.lists[list.lists.length - 1].todos = [];
    setLists([...lists]);
    localStorage.setItem(APP_NAME + LIST_KEY, JSON.stringify(lists));
  };

  /* Settings */
  const current = getCurrentList();
  const iconSize = 20;
  const onFinalList = listIndex + 1 === current.lists.length;

  /* Permissions */
  const canAddTodo = listIndex === 0;
  const canDisplayArchiveTodos =
    listIndex + 1 === current.lists.length &&
    current.lists[listIndex].todos.length > 0;

  /* Display helper functions */
  const displayListHeading = current.lists.map((list, index) => (
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

  const displayTodos = current.lists[listIndex].todos.map((todo) => {
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
          disabled={current.lists[current.lists.length - 1].todos.length < 1}
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
        <div className="panel-heading">
          <div
            className={"dropdown " + (listSelectDropdown ? "is-active" : "")}
          >
            <div className="dropdown-trigger">
              <button
                className="button"
                aria-haspopup="true"
                aria-controls="dropdown-menu"
                onClick={() => {
                  setListSelectDropdown(!listSelectDropdown);
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
              >
                <h1 className="list-name">{current.name}</h1>
                <RiArrowDropDownLine size={30} />
              </button>
            </div>
            <div
              className="dropdown-menu"
              id="dropdown-menu"
              role="menu"
              style={{
                left: "-4rem",
                width: "15rem",
              }}
            >
              <div className="dropdown-content pr-4">
                <a className="dropdown-item">
                  <input type="text" className="input" />
                  &nbsp;
                  <button className="button">+</button>
                  &nbsp;
                </a>
              </div>
            </div>
          </div>
        </div>
        <p className="panel-tabs">{displayListHeading}</p>
        {displayTodos}
        {canAddTodo && displayAddTodo}
        {canDisplayArchiveTodos && displayArchiveTodos}
      </div>
    </div>
  );
}

export default App;
