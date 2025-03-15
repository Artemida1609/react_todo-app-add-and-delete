import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../enums/FilterType';
import { deleteTodo } from '../api/todos';

type Props = {
  todosCounter: number;
  selectedLink: FilterType;
  setSelectedLink: (arg: FilterType) => void;
  todos: Todo[];
  allTodos: Todo[];
  setTodos: (arg: Todo[]) => void;
  setAllTodos: (arg: Todo[]) => void;
  errorMessage: string;
  setErrorMessage: (arg: string) => void;
  selectedTodos: number[];
};

export const Footer: React.FC<Props> = ({
  todosCounter,
  selectedLink,
  setSelectedLink,
  todos,
  allTodos,
  setTodos,
  setAllTodos,
  errorMessage,
  setErrorMessage,
  selectedTodos,
}) => {
  const findSelected = () => {
    return todos.filter(todo => selectedTodos.includes(todo.id));
  };

  // const fetchTodos = () => {
  //   getTodos()
  //     .then(fetchedTodos => {
  //       setTodos(fetchedTodos);
  //       setAllTodos(fetchedTodos);
  //     })
  //     .catch(() => setErrorMessage('Unable to fetch todos'));
  // };

  //#region handle functions
  const handleClearCompleted = () => {
    const selected = findSelected();
    const completedTodos = todos.filter(todo => todo.completed);
    const allCompletedTodos = [...completedTodos, ...selected];

    Promise.allSettled(
    allCompletedTodos.map(todo => deleteTodo(todo.id))
  )
      .then(() => {
        const activeTodos = todos.filter(
          todo => !todo.completed && !selected.includes(todo),
        );
        setTodos(activeTodos);
        setAllTodos(activeTodos);
      })
      .catch(() => setErrorMessage(`Unable to delete a todo`));
  };
  //#endregion

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      {/* Active link should have the 'selected' class */}

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(type => {
          return (
            <a
              href="#/"
              key={type}
              className={classNames('filter__link', {
                selected: selectedLink === type,
              })}
              data-cy={type === 'All' ? 'FilterLinkAll' : `FilterLink${type}`}
              onClick={() => {
                setSelectedLink(type);
              }}
            >
              {type}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      {/* {(todos.some(todo => todo.completed) || allTodos.filter(todo => todo.completed).length > 0) && ( */}
      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={
          !todos.some(todo => todo.completed) ||
          allTodos.filter(todo => todo.completed).length === 0
        }
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
