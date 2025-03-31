import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  tags: string[];
}

interface UseTaskCopilotFeaturesProps {
  tasks: Task[];
  addTask: (taskData: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  formatDueDate: (dateString: string) => string;
}

export const useTaskCopilotFeatures = ({
  tasks,
  addTask,
  deleteTask,
  toggleTaskCompletion,
  formatDueDate,
}: UseTaskCopilotFeaturesProps) => {
  // Make tasks available to the AI assistant
  useCopilotReadable({
    description: "Detailed list of all tasks",
    value: JSON.stringify(
      tasks.map((task) => ({
        ...task,
        formattedDueDate: formatDueDate(task.dueDate),
        status: task.completed ? "completed" : "active",
      }))
    ),
  });

  // Task statistics for better AI context
  useCopilotReadable({
    description: "Task statistics and overview information",
    value: JSON.stringify({
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task) => task.completed).length,
      activeTasks: tasks.filter((task) => !task.completed).length,
      highPriorityTasks: tasks.filter(
        (task) => task.priority === "high" && !task.completed
      ).length,
      mediumPriorityTasks: tasks.filter(
        (task) => task.priority === "medium" && !task.completed
      ).length,
      lowPriorityTasks: tasks.filter(
        (task) => task.priority === "low" && !task.completed
      ).length,
      overdueTasks: tasks.filter(
        (task) =>
          !task.completed &&
          new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
      ).length,
      dueTodayTasks: tasks.filter(
        (task) =>
          !task.completed &&
          new Date(task.dueDate).toDateString() === new Date().toDateString()
      ).length,
      allTags: Array.from(new Set(tasks.flatMap((task) => task.tags || []))),
    }),
  });

  // Add Task Action
  useCopilotAction({
    name: "addTask",
    description:
      "Create a new task with title, description, priority, and due date",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the task (required)",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "A detailed description of the task (optional)",
      },
      {
        name: "priority",
        type: "string",
        description:
          "The priority level: 'low', 'medium', or 'high' (defaults to medium)",
      },
      {
        name: "dueDate",
        type: "string",
        description: "The due date in YYYY-MM-DD format (defaults to today)",
      },
      {
        name: "tags",
        type: "string",
        description: "Comma-separated list of tags for the task",
      },
    ],
    handler: ({ title, description, priority, dueDate, tags }) => {
      if (!title || title.trim() === "") {
        throw new Error("Task title is required");
      }

      const validPriorities = ["low", "medium", "high"];
      const taskPriority = priority?.toLowerCase() || "medium";

      if (!validPriorities.includes(taskPriority)) {
        throw new Error("Priority must be 'low', 'medium', or 'high'");
      }

      let taskDueDate = dueDate;
      if (!taskDueDate) {
        taskDueDate = new Date().toISOString().split("T")[0];
      } else {
        // Validate date format
        try {
          new Date(taskDueDate).toISOString();
        } catch (e) {
          throw new Error("Invalid date format. Please use YYYY-MM-DD");
          console.log(e);
        }
      }

      // Process tags if provided
      let taskTags: string[] = [];
      if (tags) {
        taskTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");
      }

      // Create the task
      const newTask = {
        title,
        description: description || "",
        priority: taskPriority as "low" | "medium" | "high",
        dueDate: taskDueDate,
        completed: false,
        tags: taskTags,
      };

      addTask(newTask);

      return `Task "${title}" created successfully with ${taskPriority} priority, due on ${formatDueDate(
        taskDueDate
      )}${taskTags.length > 0 ? ` and tags: ${taskTags.join(", ")}` : ""}`;
    },
    render: ({ status, result }) => (
      <div className="flex justify-center items-center text-sm">
        {status !== "complete" && <p>Adding task...</p>}
        {status === "complete" && (
          <div className="flex gap-2">
            <span>✅</span>
            <span className="font-semibold">{result}</span>
          </div>
        )}
      </div>
    ),
  });

  // Delete Task Action
  useCopilotAction({
    name: "deleteTask",
    description: "Delete a task by its ID or title",
    parameters: [
      {
        name: "identifier",
        type: "string",
        description: "The ID or title of the task to delete (required)",
        required: true,
      },
    ],
    handler: ({ identifier }) => {
      if (!identifier) {
        throw new Error("Task ID or title is required");
      }

      // First try to find task by ID
      let taskToDelete = tasks.find((task) => task.id === identifier);

      // If not found by ID, try to find by title (case insensitive)
      if (!taskToDelete) {
        taskToDelete = tasks.find(
          (task) => task.title.toLowerCase() === identifier.toLowerCase()
        );
      }

      if (!taskToDelete) {
        throw new Error(`No task found with ID or title: ${identifier}`);
      }

      deleteTask(taskToDelete.id);
      return `Task "${taskToDelete.title}" has been successfully deleted.`;
    },
    render: ({ status, result }) => (
      <div className="flex justify-center items-center text-sm">
        {status !== "complete" && <p>Deleting task...</p>}
        {status === "complete" && (
          <div className="flex gap-2">
            <span>✅</span>
            <span className="font-semibold">{result}</span>
          </div>
        )}
      </div>
    ),
  });

  // Mark Task as Complete/Incomplete Action
  useCopilotAction({
    name: "toggleTaskCompletion",
    description: "Mark a task as complete or incomplete",
    parameters: [
      {
        name: "identifier",
        type: "string",
        description:
          "The ID or title of the task to toggle completion (required)",
        required: true,
      },
    ],
    handler: ({ identifier }) => {
      if (!identifier) {
        throw new Error("Task ID or title is required");
      }

      // First try to find task by ID
      let task = tasks.find((task) => task.id === identifier);

      // If not found by ID, try to find by title (case insensitive)
      if (!task) {
        task = tasks.find(
          (task) => task.title.toLowerCase() === identifier.toLowerCase()
        );
      }

      if (!task) {
        throw new Error(`No task found with ID or title: ${identifier}`);
      }

      toggleTaskCompletion(task.id);

      // We need to check the current state because the toggle hasn't been applied yet
      const newStatus = !task.completed ? "complete" : "incomplete";

      return `Task "${task.title}" has been marked as ${newStatus}.`;
    },
    render: ({ status, result }) => (
      <div className="flex justify-center items-center text-sm">
        {status !== "complete" && <p>Updating task status...</p>}
        {status === "complete" && (
          <div className="flex gap-2">
            <span>✅</span>
            <span className="font-semibold">{result}</span>
          </div>
        )}
      </div>
    ),
  });

  // List Tasks Action
  useCopilotAction({
    name: "listTasks",
    description: "List tasks filtered by status, priority, or date period",
    parameters: [
      {
        name: "status",
        type: "string",
        description: "Filter by status: 'all', 'active', or 'completed'",
      },
      {
        name: "priority",
        type: "string",
        description: "Filter by priority: 'high', 'medium', or 'low'",
      },
      {
        name: "period",
        type: "string",
        description:
          "Filter by time period: 'today', 'tomorrow', 'this week', 'overdue'",
      },
      {
        name: "tag",
        type: "string",
        description: "Filter by a specific tag",
      },
    ],
    handler: ({ status, priority, period, tag }) => {
      let filteredTasks = [...tasks];
      const filterCriteria: string[] = [];

      // Filter by status
      if (status) {
        if (status === "active") {
          filteredTasks = filteredTasks.filter((task) => !task.completed);
          filterCriteria.push("active");
        } else if (status === "completed") {
          filteredTasks = filteredTasks.filter((task) => task.completed);
          filterCriteria.push("completed");
        }
      }

      // Filter by priority
      if (priority) {
        filteredTasks = filteredTasks.filter(
          (task) => task.priority === priority.toLowerCase()
        );
        filterCriteria.push(`${priority.toLowerCase()} priority`);
      }

      // Filter by period
      if (period) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (period === "today") {
          filteredTasks = filteredTasks.filter(
            (task) =>
              new Date(task.dueDate).toDateString() === today.toDateString()
          );
          filterCriteria.push("due today");
        } else if (period === "tomorrow") {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          filteredTasks = filteredTasks.filter(
            (task) =>
              new Date(task.dueDate).toDateString() === tomorrow.toDateString()
          );
          filterCriteria.push("due tomorrow");
        } else if (period === "this week") {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);

          filteredTasks = filteredTasks.filter((task) => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= weekStart && taskDate <= weekEnd;
          });
          filterCriteria.push("due this week");
        } else if (period === "overdue") {
          filteredTasks = filteredTasks.filter(
            (task) => new Date(task.dueDate) < today && !task.completed
          );
          filterCriteria.push("overdue");
        }
      }

      // Filter by tag
      if (tag) {
        filteredTasks = filteredTasks.filter(
          (task) => task.tags && task.tags.includes(tag)
        );
        filterCriteria.push(`tagged with "${tag}"`);
      }

      const filterDescription =
        filterCriteria.length > 0
          ? `Filtered by: ${filterCriteria.join(", ")}`
          : "All tasks";

      const formattedTasks = filteredTasks.map((task) => ({
        id: task.id,
        title: task.title,
        priority: task.priority,
        dueDate: formatDueDate(task.dueDate),
        completed: task.completed ? "Yes" : "No",
        tags: task.tags.join(", "),
        description: task.description || "(No description)",
      }));

      return {
        summary: `Found ${formattedTasks.length} tasks. ${filterDescription}`,
        tasks: formattedTasks,
      };
    },
  });

  // AI suggestions for tasks
  useCopilotChatSuggestions({
    instructions: `Suggest helpful actions for managing tasks. You can:
    1. Offer to create new tasks with appropriate titles, descriptions, and due dates.
    2. Suggest listing tasks by different filters (e.g., high priority, due today, completed).
    3. Recommend marking completed tasks.
    4. Help organize tasks by suggesting tags or priorities.
    5. Remind about overdue tasks if any exist.

    When suggesting task creation, consider what might be logically needed based on existing tasks.
    Be conversational but concise in your suggestions. Format important information like dates, priorities, or task counts to make them stand out.
    
    Your suggestions should be helpful for productivity and task management.`,
  });
};
