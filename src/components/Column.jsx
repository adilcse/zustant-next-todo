import { useStore } from '../store';
import Task from './Task';
import './Column.css';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { shallow } from 'zustand/shallow';
import AddEditCard from './AddEditCard';

export default function Column({ status, showAddButton = false }) {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const tasks = useStore(
    (store) => {
       return store.tasks?.filter((task) => task.status === status);
      },
    shallow
  ) || [];
  const addTask = useStore((store) => store.addTask);
  const editTask = useStore((store) => store.editTask);
  const setDraggedTask = useStore((store) => store.setDraggedTask);
  const draggedTask = useStore((store) => store.draggedTask);
  const moveTask = useStore((store) => store.moveTask);

  const setEditItem = (task) => {
    setActiveTask(task);
    setOpen(true);
  }
  return (
    <div
      className={classNames('column', { drop: drop })}
      onDragOver={(e) => {
        setDrop(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setDrop(false);
        e.preventDefault();
      }}
      onDrop={(e) => {
        setDrop(false);
        moveTask(draggedTask, status);
        setDraggedTask(null);
      }}
    >
      <div className="titleWrapper">
        <p>{status}</p>
        {showAddButton && <button onClick={() => setOpen(true)}>Add</button>}
      </div>  
      {tasks.map((task) => (
        <Task task={task} key={task.id} onClick={()=> setEditItem(task)} />
      ))}
      {open && <AddEditCard setOpen={setOpen}
      activeTask={activeTask}
      addTask={addTask}
      editTask={(task) => {editTask(task);
        setActiveTask(null)}}/>}
    </div>
  );
}

