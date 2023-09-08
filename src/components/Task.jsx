import classNames from 'classnames';
import { useStore } from '../store';
import './Task.css';
import trash from '../assets/trash-2.svg';

export default function Task({ task , onClick }) {
 
 
  const setDraggedTask = useStore((store) => store.setDraggedTask);
  const deleteTask = useStore((store) => store.deleteTask);

  return (
    <div
      className="task mt-3"
      draggable
      onDragStart={() => setDraggedTask(task.id)}
      onClick={onClick}
    >
      <div>{task.title}</div>
      <div className="bottomWrapper">
        <div>
          <img src={trash} onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteTask(task.id);
            }} />
        </div>
        <div>
          {/* <button >Edit</button> */}
        </div>
        <div className={classNames('status', task.status)}>{task.status}</div>
      </div>
    </div>
  );
}
