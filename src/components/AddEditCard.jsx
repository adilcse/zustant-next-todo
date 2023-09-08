import React, { useEffect, useRef } from 'react';
import './AddEditCard.css';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';


function AddEditCard({ addTask, editTask, activeTask, setOpen }) {
  const [task, setTask] = React.useState({
    title: '',
    body: '',
    status: 'PLANNED',
  });
  useEffect(() => {
    if (activeTask) {
      setTask(activeTask);
    }
  }, [activeTask]);

  const [error, setError] = React.useState('');

  const onButtonClicked = () => {
    if (task.title.length < 2) {
      setError('Title must be at least 2 characters');
      return;
    }
    setError('');
    
    if (activeTask) {
      editTask(task);
      setOpen(false);
    } else {
        addTask(task);
        setOpen(false);
    }
  }
  return (
    <div className="Modal">
      <div className="modalContent">
      <TextField fullWidth label={"Todo"} id="inputfield" onChange={(e) => setTask({ ...task, title: e.target.value })} value={task.title} />
        <TextField className="mt-2" type='textarea' fullWidth label={"Body"} id="inputfieldbox" onChange={(e) => setTask({ ...task, body: e.target.value })} value={task.body} />
        
        <p className="warn">{error}</p>
        <div className="button d-flex gap-3">
        <Button variant="contained" color='error' className="button" onClick={()=> setOpen(false)}>Cancle</Button>
          <Button variant="contained" className="button" onClick={onButtonClicked}>Submit</Button>
        </div>
      </div>
    </div>
  )
}
export default AddEditCard