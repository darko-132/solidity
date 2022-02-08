// maneja la interaccion del usuario

const taskform = document.querySelector('#taskform');

taskform.addEventListener("submit", e =>{
	e.preventDefault()

	App.createTask(
		taskform["title"].value,
		taskform["description"].value
	)
});
