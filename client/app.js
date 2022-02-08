//interactibidad para fromten
// se usara una forma de codigo orientada a objetos

App = {
	contracts: {}, /* aloja los contratos */
	init: async ()=>{
		console.log('Loaded')
		await App.loadEthereum()
		await App.loadContracts()
		await App.loadAccount()
		App.render()
		await App.renderTask()
	},

	loadEthereum: async ()=>{ /*comprueba se metamask esta instalada*/

		if(window.ethereum){
			App.web3Provider = window.ethereum /* si existe crea la propidad web3Provider */
			console.log(App.web3Provider)
			await window.ethereum.request({method: 'eth_requestAccounts'})
		}else if(window.web3){ /* esta parte solo para hacer comapatible con la version antigua web3 */
			web3 = new web3(window.web3.currentProvider)
		}else{
			console.log('Por favor instale metaMask')
		}
	},
	
	loadAccount: async() =>{ /* obtiene la wallet */
		const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
		App.account = accounts[0]
	},

	render: ()=>{ /* Imprime la wallet */
		console.log(App.account)
		document.getElementById('account').innerText = App.account
	},
	
	renderTask: async ()=>{ /* imprime las notas */
		const taskCounter = await App.taskContract.tasksCounter()
		const taskCounterNumber = taskCounter.toNumber()

		let html = ''

		for (let i = 1; i <= taskCounterNumber; i++) {
			const task = await App.taskContract.tasks(i)
			const taskId = task[0]
			const taskTitle = task[1]
			const taskDescription = task[2]
			const taskDone = task[3]
			const taskCreated = task[4]

			let taskElement = `
			<div class="card bg-dark rounded-0 mb-2">
				<div class="card-header d-flex justify-content-between align-items-center">
					<span>${taskTitle} </span>
					<div class="form-check form-switch">
						<input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone && "checked"}
							onchange="App.toggleDone(this)"/* this hace refenrencia el input en si */
						/>
					</div>
				</div>
				<div class="card-body">
					<span>${taskDescription} </span>
					<p class="text-muted">Tarea creada ${new Date (taskCreated * 1000).toLocaleString()}<p/>
				</div>
			</div>
			`

			html += taskElement
		}
		document.querySelector('#tasksList').innerHTML = html;
	},

	loadContracts: async () =>{ /* manejo del contrato */
		const res = await fetch("Taskscontract.json") //trae el contrato
		const taskscontractJSON = await res.json() //lo convierte en un obj

		App.contracts.tasksContract= TruffleContract(taskscontractJSON) // pone disponible el contrato
		
		App.contracts.tasksContract.setProvider(App.web3Provider) //conecta el contrato a metamask

		App.taskContract = await App.contracts.tasksContract.deployed() // despliega el contrato
	},

	createTask : async (title, description) => { /* crea las tareas */
		const result = await App.taskContract.createTask(title, description,{
			from: App.account
		})
		console.log(result.logs[0].args)
	},
	toggleDone: async (element) =>{
		const taskId = element.dataset.id

		await App.taskContract.toggleDone(taskId, {
			from: App.account
		})
		window.Location.reload()
	}

}

App.init()
