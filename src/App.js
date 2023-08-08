import React, { useState, useEffect, useCallback} from 'react';
import './App.css';
import { ethers } from 'ethers';
import ABI from './abi.json';

const CONTRACT_ADDRESS = '0xA736c7c8AC4fd95CBf712cd17553Df22f2f11ad7'; // Replace with actual contract address

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskContent, setNewTaskContent] = useState('');

  const updateTaskList = useCallback(async () => {
    const tasksArray = [];
    if (contract) {
      const taskCount = await contract.taskCount();
      
    
      for (let i = 1; i <= taskCount; i++) {
        const task = await contract.tasks(i);
        tasksArray.push(task);
      }
    }
  
    setTasks(tasksArray);
  }, [contract]);
  

  useEffect(() => {
    async function initializeEthers() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        setContract(contract);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        updateTaskList();
      }
    }

    initializeEthers();
  }, [updateTaskList]);

  async function createTask() {
    if (!newTaskContent) return;

    const transaction = await contract.createTask(newTaskContent);
    await transaction.wait();
    setNewTaskContent('');
    updateTaskList();
  }

  async function toggleTaskCompletion(taskId) {
    const transaction = await contract.toggleTaskCompletion(taskId);
    await transaction.wait();
    updateTaskList();
  }

  
  return (
    <div className="App">
      <h1>ToDoList</h1>
      <div>
        <input
          type="text"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={createTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <span>{task.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
