import Todo from "../models/Todo.js";

// ✅ Get all todos (with filtering, search, sorting, pagination)
export const getTodos = async (req, res) => {
  try {
    const { status, priority, sort, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status === "completed") query.completed = true;
    if (status === "pending") query.completed = false;
    if (priority) query.priority = priority;
    if (search) query.task = { $regex: search, $options: "i" };

    let todos = Todo.find(query);

    // Sorting
    if (sort === "date") todos = todos.sort({ dueDate: 1 });
    if (sort === "priority") todos = todos.sort({ priority: -1 });
    if (sort === "alphabetical") todos = todos.sort({ task: 1 });

    // Pagination
    const skip = (page - 1) * limit;
    todos = todos.skip(skip).limit(Number(limit));

    const results = await todos;
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create new todo
export const createTodo = async (req, res) => {
  try {
    const todo = new Todo(req.body);
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Update todo (edit task, notes, dueDate, etc.)
export const updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Todo not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete todo
export const deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Toggle completion
export const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.completed = !todo.completed;
    const updated = await todo.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
