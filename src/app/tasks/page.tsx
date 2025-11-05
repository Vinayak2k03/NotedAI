"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CheckCircle,
  Plus,
  Tag,
  Filter,
  ArrowUpDown,
  X,
  CalendarCheck,
  AlertCircle,
  ArrowLeftIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTaskCopilotFeatures } from "@/hooks/useTaskCopilotFeatures";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  tags: string[];
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const lastAddSigRef = useRef<{ sig: string; at: number } | null>(null);
  // Instead of using Partial<Task>, define it with required properties but optional values:
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    tags: string[];
  }>({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0], // Default to today
    completed: false,
    priority: "medium",
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "title">(
    "dueDate"
  );
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();


  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Error parsing tasks from localStorage", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Modified to support adding tasks from the Copilot
  const handleAddTask = (taskData?: Omit<Task, "id">) => {
    // First, ensure we have the current state by using a function parameter
    const taskToAdd = taskData || { ...newTask };

    // Debug logging
    console.log("Task being added:", taskToAdd);
    console.log(
      "Title value:",
      taskToAdd.title,
      "Length:",
      taskToAdd.title?.length
    );

    // More robust title check
    if (!taskToAdd.title || taskToAdd.title.trim() === "") {
      toast.error("Task title required", {
        description: "Please provide a title for your task.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Build a duplicate signature to guard against double invocation
      const normalizedTitle = taskToAdd.title.trim().toLowerCase();
      const dateOnly = (taskToAdd.dueDate || new Date().toISOString().split("T")[0]).trim();
      const sig = `${normalizedTitle}|${dateOnly}`;
      const now = Date.now();
      if (lastAddSigRef.current && lastAddSigRef.current.sig === sig && now - lastAddSigRef.current.at < 3000) {
        // Ignore duplicate add within 3 seconds
        return null;
      }
      lastAddSigRef.current = { sig, at: now };

      // Prevent adding an identical task if one already exists
      const exists = tasks.some(
        (t) => t.title.trim().toLowerCase() === normalizedTitle && t.dueDate === dateOnly
      );
      if (exists) {
        return null;
      }

      const task: Task = {
        id: Date.now().toString(),
        title: taskToAdd.title.trim(), // Ensure title is trimmed
        description: taskToAdd.description || "",
        dueDate: dateOnly,
        completed: false,
        priority: taskToAdd.priority || "medium",
        tags: taskToAdd.tags || [],
      };

      // First create a copy of the previous tasks to avoid state issues
      setTasks((prevTasks) => [...prevTasks, task]);

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        completed: false,
        priority: "medium",
        tags: [],
      });
      setIsDialogOpen(false);

      toast.success("Task created", {
        description: "Your task was successfully created.",
      });

      return task;
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task", {
        description: "An unexpected error occurred.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast.success("Task deleted", {
      description: "Your task was successfully deleted.",
    });
  };

  const addTagToNewTask = () => {
    if (!newTagInput.trim()) return;

    setNewTask((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), newTagInput.trim()],
    }));

    setNewTagInput("");
  };

  const removeTagFromNewTask = (tagToRemove: string) => {
    setNewTask((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter((task) => {
      if (tagFilter) return task.tags?.includes(tagFilter);
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === "priority") {
        const priorityWeight = { low: 0, medium: 1, high: 2 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags || [])));

  // Format due date display
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Initialize the copilot features
  useTaskCopilotFeatures({
    tasks,
    addTask: handleAddTask,
    deleteTask,
    toggleTaskCompletion,
    formatDueDate,
  });

  // Helper to get priority-related styles
  const getPriorityStyles = (priority: string, completed: boolean) => {
    if (completed) {
      return {
        // Light mode
        borderColor: "border-green-400/30 dark:border-green-800/20",
        bgColor: "bg-green-100/30 dark:bg-green-900/10",
        accentColor: "bg-green-400/20 dark:bg-green-800/20",
        textColor: "text-green-700 dark:text-green-300",
        iconColor: "text-green-600/60 dark:text-green-400/60",
        badgeVariant: "outline" as const,
        badgeTextColor: "text-green-700 dark:text-green-300",
      };
    }

    switch (priority) {
      case "high":
        return {
          // Light mode
          borderColor: "border-red-400/30 dark:border-red-900/30",
          bgColor: "bg-red-100/20 dark:bg-red-950/10",
          accentColor: "bg-red-400/20 dark:bg-red-900/20",
          textColor: "text-red-600 dark:text-red-400",
          iconColor: "text-red-600/70 dark:text-red-500/70",
          badgeVariant: "destructive" as const,
          badgeTextColor: "text-red-50",
        };
      case "medium":
        return {
          borderColor: "border-amber-400/20 dark:border-orange-900/20",
          bgColor: "bg-amber-100/20 dark:bg-amber-950/5",
          accentColor: "bg-amber-400/20 dark:bg-amber-900/20",
          textColor: "text-amber-600 dark:text-amber-400",
          iconColor: "text-amber-600/70 dark:text-amber-500/70",
          badgeVariant: "default" as const,
          badgeTextColor: "text-amber-50",
        };
      default:
        return {
          borderColor: "border-blue-400/20 dark:border-blue-900/20",
          bgColor: "bg-blue-100/20 dark:bg-blue-950/5",
          accentColor: "bg-blue-400/20 dark:bg-blue-900/20",
          textColor: "text-blue-600 dark:text-blue-400",
          iconColor: "text-blue-600/60 dark:text-blue-500/60",
          badgeVariant: "outline" as const,
          badgeTextColor: "text-blue-600 dark:text-blue-300",
        };
    }
  };


  return (
    <main className="mt-20 p-6 container mx-auto max-w-7xl">
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 -mx-6 px-6 py-6 mb-8 shadow-md transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="rounded-full w-10 h-10 bg-background/50 dark:bg-white/10 border-border dark:border-transparent backdrop-blur-sm hover:bg-accent/50 dark:hover:bg-white/20 transition-all"
              >
                <ArrowLeftIcon className="h-5 w-5 text-foreground dark:text-white" />
              </Button>
              <h1 className="text-3xl font-bold text-foreground dark:text-white tracking-tight">
                Tasks
              </h1>
            </div>

            <p className="text-muted-foreground dark:text-white/70 mt-1">
              You have{" "}
              <span className="font-medium text-foreground dark:text-white">
                {tasks.filter((task) => !task.completed).length} active tasks
              </span>
              .
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary/90 dark:bg-white/15 text-primary-foreground dark:text-white border-none hover:bg-primary dark:hover:bg-white/25 transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background dark:bg-slate-900 border-border dark:border-slate-700/50">
              <DialogHeader>
                <DialogTitle className="text-foreground dark:text-white">Create New Task</DialogTitle>
                <DialogDescription className="text-muted-foreground dark:text-slate-400">
                  Add a new task to your list
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground dark:text-white">Title</Label>
                  <Input
                    id="title"
                    placeholder="Task title"
                    value={newTask.title || ""}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="bg-background dark:bg-slate-800 text-foreground dark:text-white border-input dark:border-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground dark:text-white">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Task details"
                    value={newTask.description || ""}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    rows={3}
                    className="bg-background dark:bg-slate-800 text-foreground dark:text-white border-input dark:border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-foreground dark:text-white">Due Date</Label>
                    <div className="flex">
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate || ""}
                        onChange={(e) =>
                          setNewTask({ ...newTask, dueDate: e.target.value })
                        }
                        className="w-full bg-background dark:bg-slate-800 text-foreground dark:text-white border-input dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-foreground dark:text-white">Priority</Label>
                    <Select
                      value={newTask.priority || "medium"}
                      onValueChange={(value) =>
                        setNewTask({
                          ...newTask,
                          priority: value as "low" | "medium" | "high",
                        })
                      }
                    >
                      <SelectTrigger id="priority" className="bg-background dark:bg-slate-800 text-foreground dark:text-white border-input dark:border-slate-700">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-background dark:bg-slate-800 text-foreground dark:text-white border-input dark:border-slate-700">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground dark:text-white">Tags</Label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {(newTask.tags || []).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-2 py-1 bg-accent/50 dark:bg-slate-700"
                      >
                        {tag}
                        <button
                          onClick={() => removeTagFromNewTask(tag)}
                          className="ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTagToNewTask();
                        }
                      }}
                      className="flex-1 bg-background dark:bg-slate-800 text-foreground dark:text-white border-input dark:border-slate-700"
                    />
                    <Button
                      onClick={addTagToNewTask}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-input dark:border-slate-700 text-foreground dark:text-white"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-input dark:border-slate-700 text-foreground dark:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Create a local copy and ensure all required properties are present
                    const currentTask = {
                      title: newTask.title || "", // Ensure title is never undefined
                      description: newTask.description || "", // Ensure description is never undefined
                      dueDate:
                        newTask.dueDate ||
                        new Date().toISOString().split("T")[0], // Default to today
                      completed: newTask.completed || false, // Default to false
                      priority: newTask.priority || "medium", // Default to medium
                      tags: newTask.tags || [], // Default to empty array
                    };

                    // Only proceed if title is not empty after trimming
                    if (currentTask.title.trim() !== "") {
                      console.log("Submitting task:", currentTask);
                      handleAddTask(currentTask);
                    } else {
                      toast.error("Task title required", {
                        description: "Please provide a title for your task.",
                      });
                    }
                  }}
                  disabled={isLoading || !newTask.title?.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-accent/70 dark:bg-slate-800/50 p-1.5 rounded-md">
              <Filter className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
            </div>
            <span className="text-sm text-muted-foreground dark:text-slate-400 font-medium">Filter:</span>
            <Select
              value={filter}
              onValueChange={(value: "all" | "active" | "completed") =>
                setFilter(value)
              }
            >
              <SelectTrigger className="h-8 w-32 bg-background/50 dark:bg-slate-900/50 border-input/50 dark:border-slate-700/50">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-slate-900 border-input dark:border-slate-700">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-accent/70 dark:bg-slate-800/50 p-1.5 rounded-md">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
            </div>
            <span className="text-sm text-muted-foreground dark:text-slate-400 font-medium">Sort by:</span>
            <Select
              value={sortBy}
              onValueChange={(value: "dueDate" | "priority" | "title") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="h-8 w-32 bg-background/50 dark:bg-slate-900/50 border-input/50 dark:border-slate-700/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-slate-900 border-input dark:border-slate-700">
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {allTags.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="bg-accent/70 dark:bg-slate-800/50 p-1.5 rounded-md">
                <Tag className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
              </div>
              <span className="text-sm text-muted-foreground dark:text-slate-400 font-medium">Tag:</span>
              <Select
                value={tagFilter || "all_tags"}
                onValueChange={(value) =>
                  setTagFilter(value === "all_tags" ? null : value)
                }
              >
                <SelectTrigger className="h-8 w-32 bg-background/50 dark:bg-slate-900/50 border-input/50 dark:border-slate-700/50">
                  <SelectValue placeholder="Tag filter" />
                </SelectTrigger>
                <SelectContent className="bg-background dark:bg-slate-900 border-input dark:border-slate-700">
                  <SelectItem value="all_tags">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {filteredAndSortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTasks.map((task) => {
            const styles = getPriorityStyles(task.priority, task.completed);

            return (
              <Card
                key={task.id}
                className={`group border border-border/50 dark:border-0 shadow-md hover:shadow-lg transition-all overflow-hidden 
                           bg-card/90 dark:bg-gradient-to-b dark:from-slate-900/95 dark:to-slate-950/90 backdrop-blur-sm ${
                  task.completed ? "opacity-80" : ""
                }`}
              >
                {/* Left side priority indicator bar - slightly wider */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.accentColor}`}
                ></div>

                <div className="p-5 pl-6">
                  {/* Header with checkbox and delete */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`p-0.5 rounded-full ${
                          task.completed
                            ? "bg-green-200/50 dark:bg-green-900/30"
                            : styles.accentColor
                        }`}
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className={`h-5 w-5 rounded-full border-0 ${
                            task.completed
                              ? "text-green-600 dark:text-green-400 data-[state=checked]:bg-green-500/30"
                              : task.priority === "high"
                              ? "text-red-600 dark:text-red-400 data-[state=checked]:bg-red-500/30"
                              : task.priority === "medium"
                              ? "text-orange-600 dark:text-orange-400 data-[state=checked]:bg-orange-500/30"
                              : "text-blue-600 dark:text-blue-400 data-[state=checked]:bg-blue-500/30"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-base font-medium leading-snug truncate ${
                            task.completed
                              ? "line-through text-muted-foreground/70 dark:text-slate-400/80"
                              : "text-foreground dark:text-slate-50"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p
                            className={`mt-1 text-sm leading-relaxed line-clamp-2 ${
                              task.completed
                                ? "text-muted-foreground/60 dark:text-slate-500/70"
                                : "text-muted-foreground dark:text-slate-300"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-muted-foreground dark:text-slate-400 hover:text-destructive dark:hover:text-red-400 hover:bg-destructive/10 dark:hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Due date and priority badge */}
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <div
                      className={`flex items-center gap-2 ${styles.iconColor} bg-accent/40 dark:bg-slate-800/60 px-2.5 py-1 rounded-full`}
                    >
                      <CalendarCheck className="h-3.5 w-3.5" />
                      <span className={`${styles.textColor}`}>
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>

                    <Badge
                      variant={styles.badgeVariant}
                      className={`text-xs px-2.5 py-0.5 rounded-full ${styles.badgeTextColor}`}
                    >
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </Badge>
                  </div>

                  {/* Tags at bottom */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/30 dark:border-slate-700/30">
                      {task.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className={`text-xs px-2.5 py-0.5 rounded-full bg-accent/50 hover:bg-accent/70 dark:bg-slate-800/60 dark:hover:bg-slate-700/70 transition-colors ${
                            tagFilter === tag ? "ring-1 ring-primary dark:ring-blue-400" : ""
                          }`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Completion overlay - lighter */}
                {task.completed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-500/10 dark:from-green-900/5 dark:to-green-900/10 pointer-events-none" />
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-lg bg-accent/20 dark:bg-slate-900/20 border border-border/50 dark:border-slate-800/50">
          <div className="bg-accent/50 dark:bg-slate-800/50 inline-flex rounded-full p-4 mb-4">
            {filter === "completed" ? (
              <CheckCircle className="h-8 w-8 text-muted-foreground dark:text-slate-400" />
            ) : (
              <AlertCircle className="h-8 w-8 text-muted-foreground dark:text-slate-400" />
            )}
          </div>
          <h3 className="text-xl font-medium text-foreground dark:text-white">No tasks found</h3>
          <p className="text-muted-foreground dark:text-slate-400 mt-2 max-w-md mx-auto">
            {filter !== "all"
              ? `No ${filter} tasks to display. Try changing your filters.`
              : "You don't have any tasks yet. Click 'Add Task' to create one."}
          </p>
          {filter === "all" && tasks.length === 0 && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="mt-4 bg-primary/80 hover:bg-primary text-primary-foreground dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          )}
        </div>
      )}
    </main>
  );
}