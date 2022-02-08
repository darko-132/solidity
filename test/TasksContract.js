const TasksContract = artifacts.require('TasksContract')

contract("TasksContract", ()=>{
	before(async ()=>{
		this.taskscontract = await TasksContract.deployed()
	})
	it('migrate deployed successfully', async()=>{
		const address = this.taskscontract.address
		assert.notEqual(address, null);
		assert.notEqual(address, undefined);
		assert.notEqual(address, 0x0);
		assert.notEqual(address, "");
	})
	it('get Tast list', async ()=>{
		const taskscounter = await this.taskscontract.tasksCounter();
		const task = await this.taskscontract.tasks(taskscounter);

		assert.equal(task.id.toNumber(), taskscounter);
		assert.equal(task.title, 'Mi primera tarea');
		assert.equal(task.description, "Tengo que hacer algo");
		assert.equal(task.done, false);
		assert.equal(taskscounter, 1);
	})
	it('task create successfuly', async()=>{
		const result = await this.taskscontract.createTask('some task', 'descrption 2')
		const taskEvent = result.logs[0].args;
		const taskscounter = await this.taskscontract.tasksCounter();

		assert.equal(taskscounter, 2);
		assert.equal(taskEvent.id.toNumber(), 2);
		assert.equal(taskEvent.title, 'some task');
		assert.equal(taskEvent.description, 'descrption 2');
		assert.equal(taskEvent.done, false);

	})

	it('task toggle done', async () =>{
		const result = await this.taskscontract.toggleDone(1);
		const taskEvent = result.logs[0].args;
		const task = await this.taskscontract.tasks(1);
		
		assert.equal(task.done, true);
		assert.equal(taskEvent.done, true);
		assert.equal(taskEvent.id, 1);

	})
})