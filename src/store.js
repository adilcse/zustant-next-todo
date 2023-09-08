import axios from 'axios';
import produce from 'immer';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
const URL = 'https://app.theonlinecustomersupport.com/api/v1/demo';
const getRandomNumber = () => Math.floor(Math.random() * 10000);
const store = (set, get) => ({
  id: 0,
  tasks: [],
  draggedTask: null,
  tasksInOngoing: 0,
  addTask: async (task) => {
    try{
      const id = getRandomNumber();
      set(
        produce((store) => {
          store.tasks.push({...task, id: id});
        }),
        //(store) => ({ tasks: [...store.tasks, { title, status }] }),
        false,
        'addTask'
      );
      const resp = await axios.post(URL, {
        title: task.title,
        status: task.status,
        body: task.body
      });
      get().editTask(resp.data, id);
    } catch(error) {
      alert(error.message);
    }
  }
    ,
  editTask: (task, id = null) =>
    set((store) => {
      if (!id){
        axios.patch(`${URL}/${task.id}`, {
          title: task.title,
          body: task.body
        }).then(resp => {
          if (resp.data) {
            get().editTask(resp.data, task.id);
          }
        })
      }
      const tasks = store.tasks.map((t) => {
        if (t.id === (id || task.id)) {
          return task;
        }
        return t;
      });
      return ({tasks: tasks});
      //  tasks: store.tasks.find((t) => t.id === task.id).title = task.title;
    }),
  deleteTask: (id) =>{
    set((store) => ({
      tasks: store.tasks.filter((task) => task.id !== id),
    }));
    axios.delete(URL + '/'+id);
  },

  setDraggedTask: (id) => set({ draggedTask: id }),
  moveTask: (id, status) =>{
    set((store) => ({
      tasks: store.tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      ),
    }));
    axios.patch(URL + '/'+id, {
      status
    });
  },
  getAllTasks: () => axios.get(URL).then((resp) => set({ tasks: resp.data })),
});

const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log(args);
      set(...args);
    },
    get,
    api
  );

export const useStore = create(
  subscribeWithSelector(log(persist(devtools(store), { name: 'store' })))
);

useStore.subscribe(
  (store) => store.tasks,
  (newTasks, prevTasks) => {
    useStore.setState({
      tasksInOngoing: newTasks.filter((task) => task.status === 'ONGOING')
        .length,
    });
  }
);
