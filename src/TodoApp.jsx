import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Importação do arquivo CSS adicional para animações e estilização customizada

function App() {
  // Declarando os estados para armazenar as tarefas e os dados do formulário
  const [tasks, setTasks] = useState([]); // Armazena todas as tarefas
  const [taskTitle, setTaskTitle] = useState(""); // Título da tarefa
  const [taskDesc, setTaskDesc] = useState(""); // Descrição da tarefa
  const [taskDate, setTaskDate] = useState(""); // Data da tarefa
  const [taskPriority, setTaskPriority] = useState("baixa"); // Prioridade da tarefa (baixa, média ou alta)
  const [editingTaskId, setEditingTaskId] = useState(null); // Controla qual tarefa está sendo editada

  // Efetua a leitura das tarefas salvas no localStorage assim que o componente é montado
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks); // Se houver tarefas salvas, as adiciona ao estado
    }
  }, []);

  // Sempre que a lista de tarefas for atualizada, salva no localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Função para tratar o envio do formulário e adicionar ou editar uma tarefa
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário (recarregar a página)
    if (taskTitle.trim()) { // Verifica se o título da tarefa não está vazio
      const newTask = {
        id: editingTaskId || Date.now(), // Usa o ID da tarefa que está sendo editada ou cria um novo com base no timestamp
        title: taskTitle,
        description: taskDesc,
        date: taskDate,
        priority: taskPriority,
        completed: false, // Define a tarefa como não concluída inicialmente
      };

      if (editingTaskId) { // Se estivermos editando uma tarefa, atualiza a lista
        setTasks(tasks.map((task) => (task.id === editingTaskId ? newTask : task)));
      } else { // Caso contrário, adiciona a tarefa à lista
        setTasks([...tasks, newTask]);
      }

      // Limpa os campos do formulário após adicionar ou editar
      setTaskTitle("");
      setTaskDesc("");
      setTaskDate("");
      setTaskPriority("baixa");
      setEditingTaskId(null); // Limpa o estado de edição
    }
  };

  // Função para iniciar a edição de uma tarefa existente
  const editTask = (task) => {
    setTaskTitle(task.title); // Preenche os campos com os dados da tarefa a ser editada
    setTaskDesc(task.description);
    setTaskDate(task.date);
    setTaskPriority(task.priority);
    setEditingTaskId(task.id); // Define o ID da tarefa a ser editada
  };

  // Função para excluir uma tarefa
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id)); // Filtra a tarefa a ser excluída
  };

  // Função para marcar uma tarefa como concluída ou reabri-la
  const toggleCompleted = (id) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)) // Alterna o estado de conclusão
    );
  };

  // Função para ordenar as tarefas pela prioridade (alta, média, baixa)
  const sortTasksByPriority = (tasksList) => {
    return tasksList.sort((a, b) => {
      const priorityOrder = { alta: 0, media: 1, baixa: 2 }; // Ordem de prioridade
      return priorityOrder[a.priority] - priorityOrder[b.priority]; // Ordena as tarefas
    });
  };

  return (
    <div className="container mt-5">
      {/* Cabeçalho do aplicativo */}
      <header className="text-center mb-5">
        <h1 className="display-4 text-primary font-weight-bold">Gerenciador de Tarefas</h1>
        <p className="lead text-muted">Organize suas tarefas diárias com facilidade!</p>
      </header>

      {/* Divisão do layout em duas colunas */}
      <div className="row">
        {/* Coluna para o formulário de adicionar/editar tarefas */}
        <div className="col-md-6">
          <section className="mb-5">
            {/* Formulário para adicionar ou editar tarefas */}
            <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded bg-light">
              {/* Campo de Título */}
              <div className="mb-3">
                <label htmlFor="taskTitle" className="form-label font-weight-bold">
                  Título da tarefa:
                </label>
                <textarea
                  id="taskTitle"
                  className="form-control"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)} // Atualiza o título conforme o usuário digita
                  placeholder="Título da tarefa"
                  rows="3"
                  required
                ></textarea>
              </div>

              {/* Campo de Descrição */}
              <div className="mb-3">
                <label htmlFor="taskDesc" className="form-label font-weight-bold">
                  Descrição da tarefa:
                </label>
                <textarea
                  id="taskDesc"
                  className="form-control"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)} // Atualiza a descrição conforme o usuário digita
                  placeholder="Descrição da tarefa (opcional)"
                ></textarea>
              </div>

              {/* Campo de Data */}
              <div className="mb-3">
                <label htmlFor="taskDate" className="form-label font-weight-bold">
                  Data da tarefa:
                </label>
                <input
                  type="date"
                  id="taskDate"
                  className="form-control"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)} // Atualiza a data conforme o usuário escolhe
                  required
                />
              </div>

              {/* Campo de Prioridade */}
              <div className="mb-3">
                <label htmlFor="taskPriority" className="form-label font-weight-bold">
                  Prioridade:
                </label>
                <select
                  id="taskPriority"
                  className="form-select"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)} // Atualiza a prioridade conforme o usuário seleciona
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Botão para adicionar ou atualizar a tarefa */}
              <button type="submit" className="btn btn-primary w-100 py-2">
                {editingTaskId ? "Atualizar Tarefa" : "Adicionar Tarefa"} {/* Texto dinâmico com base no estado de edição */}
              </button>
            </form>
          </section>
        </div>

        {/* Coluna para exibir as tarefas */}
        <div className="col-md-6">
          <section>
            {/* Lista de tarefas pendentes */}
            <h2 className="mb-4 text-center section-title">Tarefas Pendentes</h2>
            <ul className="list-group">
              {sortTasksByPriority(
                tasks.filter((task) => !task.completed) // Filtra as tarefas que ainda não foram concluídas
              ).map((task) => (
                <li
                  key={task.id}
                  className="list-group-item d-flex justify-content-between align-items-center bg-light task-item"
                >
                  <div>
                    <h5 className="text-primary">{task.title}</h5>
                    <p>{task.description}</p>
                    <span className="text-muted">{task.date}</span>
                    <span
                      className={`badge ms-2 text-uppercase ${
                        task.priority === "alta"
                          ? "bg-danger" // Cor vermelha para alta prioridade
                          : task.priority === "media"
                          ? "bg-warning" // Cor amarela para média prioridade
                          : "bg-success" // Cor verde para baixa prioridade
                      }`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => toggleCompleted(task.id)} // Marca a tarefa como concluída
                    >
                      Concluir
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => editTask(task)} // Inicia a edição da tarefa
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteTask(task.id)} // Exclui a tarefa
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Lista de tarefas concluídas */}
          <section className="mt-5">
            <h2 className="mb-4 text-center section-title">Tarefas Concluídas</h2>
            <ul className="list-group">
              {sortTasksByPriority(
                tasks.filter((task) => task.completed) // Filtra as tarefas concluídas
              ).map((task) => (
                <li
                  key={task.id}
                  className="list-group-item d-flex justify-content-between align-items-center task-item-completed"
                >
                  <div>
                    <h5 className="text-success">{task.title}</h5>
                    <p>{task.description}</p>
                    <span className="text-muted">{task.date}</span>
                    <span
                      className={`badge ms-2 text-uppercase ${
                        task.priority === "alta"
                          ? "bg-danger"
                          : task.priority === "media"
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => toggleCompleted(task.id)} // Reabre a tarefa
                    >
                      Reabrir
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteTask(task.id)} // Exclui a tarefa
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
