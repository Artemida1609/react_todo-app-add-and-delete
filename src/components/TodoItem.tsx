import classNames from 'classnames';
// import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: (arg: Todo[]) => void;
  allTodos: Todo[];
  setAllTodos: (arg: Todo[]) => void;
  loadingTodo: boolean;
  setErrorMessage: (arg: string) => void;
  setLoadingTodo: (arg: boolean) => void;
  loadingTodoId: number;
  setLoadingTodoId: (arg: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  allTodos,
  setAllTodos,
  loadingTodo,
  setErrorMessage,
  setLoadingTodo,
  loadingTodoId,
  setLoadingTodoId,
}) => {
  //#region handle functions
  const handleDeleteButton = (todoId: number) => {
    // Встановлюємо тудушку на load та todoId
    setLoadingTodo(true);
    setLoadingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        const filtered = allTodos.filter(todoItem => todoItem.id !== todoId);

        setTodos([...filtered]);
        setAllTodos([...filtered]);
        setLoadingTodo(false);
        setLoadingTodoId(-1);
      })
      .catch(() => setErrorMessage(`Unable to delete a todo`));
  };

  const handleToggleTodo = () => {
    //toggle completed or not todo
    const updatedTodos = todos.map(t =>
      t.id === todo.id ? { ...t, completed: !t.completed } : t,
    );

    setTodos(updatedTodos);
    setAllTodos(updatedTodos);
  };
  //#endregion

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" aria-label="toggle todo completion">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status')}
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteButton(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodo && todo.id === loadingTodoId,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
