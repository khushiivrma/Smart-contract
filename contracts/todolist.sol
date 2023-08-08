// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToDoList {
    struct Task {
        uint256 id;
        string content;
        bool isCompleted;
    }

    uint256 public taskCount;
    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 id, string content);
    event TaskCompleted(uint256 id);

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content);
    }

    function toggleTaskCompletion(uint256 _taskId) public {
        Task storage task = tasks[_taskId];
        task.isCompleted = !task.isCompleted;
        emit TaskCompleted(_taskId);
    }
}
