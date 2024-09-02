import ToDoList from "../app/components/toDo/toDoList";

export default function Home() {
  return (
      <div>
          <h1 className="text-2xl font-bold mb-4">Welcome to Task Mate <i className="fa-solid fa-list-check"></i></h1>
          <ToDoList />
      </div>
  );
}
