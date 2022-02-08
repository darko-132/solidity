// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract Taskscontract{

	/* contador para los id */
	uint public tasksCounter = 0;


	/*El contructor se ejecuta al desplegar el contrato crea un texto de ejemplo */
	constructor (){
		createTask("Mi primera tarea" , "Tengo que hacer algo");
	}

	/* retornar los valores al ejecutarse createTask, se almacena en el log */
	event TaskCreated(
		uint id,
		string title,
		string description,
		bool done,
		uint createAt
	); 

	/* retornar los valores al ejecutarse toggleDong */
	event TaskToggelDone (
		uint id, 
		bool done);

	/* espeficica el tipo de dato para cada variable */
	struct Task{  
		uint256 id;
		string title;
		string description;
		bool done;
		uint256 createdAt;
	}

	mapping (uint256 => Task ) public tasks;

	function createTask(string memory _title, string memory _description) public{
		tasksCounter++;  /* contador para id */
		tasks[tasksCounter] = Task(tasksCounter, _title, _description, false, block.timestamp); /* se deben enviar todos las datos de struct Task en ese orden */
		emit TaskCreated(tasksCounter, _title, _description, false, block.timestamp); 
	}

	function toggleDone(uint _id) public {
		Task memory _task = tasks[_id];
		_task.done = !_task.done;
		tasks[_id] = _task;
		emit TaskToggelDone(_id, _task.done);
	}
}