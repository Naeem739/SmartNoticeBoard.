"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Trash, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

type Notice = {
  id: string;
  title: string;
  description: string;
  category: string;
  time: string;
};

const categories = ["General", "Event", "Urgent", "Reminder"];

export default function ShowNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Add Notice modal
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // Edit Notice modal

  useEffect(() => {
    fetchNotices();
  }, []);
  // getting Notices From Database. 
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/getNotices");
      const data = await res.json();
      setNotices(data.sort((a: Notice, b: Notice) => new Date(b.time).getTime() - new Date(a.time).getTime())); // Sort notices by time, newest first
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      await fetch("/api/getNotices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotices((prev) => prev.filter((notice) => notice.id !== id));
      toast.success("Notice deleted successfully!");
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice.");
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setDescription(notice.description);
    setCategory(notice.category);
    setIsEditModalOpen(true); // Open Edit Modal
  };

  const handleUpdate = async () => {
    if (!editingNotice) return;

    if (title.trim() === "" || description.trim() === "" || category.trim() === "") {
      toast.error("All fields are required.");
      return;
    }

    try {
      await fetch("/api/getNotices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingNotice.id,
          title,
          description,
          category,
        }),
      });

      setNotices((prev) =>
        prev.map((notice) =>
          notice.id === editingNotice.id ? { ...notice, title, description, category } : notice
        )
      );

      setIsEditModalOpen(false); // Close Edit Modal
      setEditingNotice(null);
      toast.success("Notice updated successfully!");
    } catch (error) {
      console.error("Error updating notice:", error);
      toast.error("Failed to update notice.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!title || !description || !category) {
      toast.error("All fields are required.");
      return;
    }

    const currentTime = new Date().toISOString();  // Get current time

    try {
      await axios.post("/api/saveNotice0", { title, description, category, time: currentTime });
      setTitle("");
      setDescription("");
      setCategory("");
      toast.success("Notice added successfully!");
      fetchNotices(); // Reload notices after adding new one
      setIsModalOpen(false); // Close the Add Notice modal
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save the notice");
    }
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    
    // Adjust for Bangladesh Time (UTC +6)
    date.setHours(date.getHours() + 6);

   
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    };

    return date.toLocaleString('en-US', options);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📢 Notices</h1>

      {/* Add Notice Button - Positioned to the left */}
      <div className="mb-4 flex justify-start">
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700">
          Add Notice
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin h-10 w-10" />
        </div>
      ) : (
        <div className="grid gap-4">
          {notices.map((notice) => (
            <Card key={notice.id} className="p-4 shadow-md border border-gray-200">
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{notice.title}</h2>
                    <p className="text-gray-600">{notice.description}</p>
                    <p className="text-sm text-gray-400">📅 {formatTime(notice.time)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="outline" onClick={() => handleEdit(notice)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(notice.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Notice Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogTitle>✏️ Add New Notice</DialogTitle>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-3 border rounded mb-4"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-3 border rounded mb-4"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded mb-4"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <DialogFooter>
              <Button type="submit" disabled={title.trim() === "" || description.trim() === "" || category.trim() === ""}>
                Save Notice
              </Button>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Notice Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>✏️ Edit Notice</DialogTitle>
          <form onSubmit={handleUpdate}>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full p-3 border rounded mb-4"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-3 border rounded mb-4"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded mb-4"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <DialogFooter>
              <Button type="submit" disabled={title.trim() === "" || description.trim() === "" || category.trim() === ""}>
                Save Notice
              </Button>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
