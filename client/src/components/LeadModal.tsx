import { useState, useEffect } from "react";
import api from "../lib/api";
import { Lead, Customer, PipelineStage, User } from "../types";

interface LeadModalProps {
  lead: Lead | null;
  onClose: () => void;
}

const LeadModal = ({ lead, onClose }: LeadModalProps) => {
  const [formData, setFormData] = useState({
    customerId: "",
    title: "",
    description: "",
    value: "",
    source: "MANUAL",
    assignedUserId: "",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
    fetchUsers();
    if (lead) {
      setFormData({
        customerId: lead.customerId,
        title: lead.title,
        description: lead.description || "",
        value: lead.value?.toString() || "",
        source: lead.source,
        assignedUserId: lead.assignedUserId || "",
      });
    }
  }, [lead]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        customerId: formData.customerId,
        title: formData.title,
        description: formData.description || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        source: formData.source,
        assignedUserId: formData.assignedUserId || undefined,
      };

      if (lead) {
        await api.put(`/leads/${lead.id}`, payload);
      } else {
        await api.post("/leads", payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg p-7 w-full max-w-lg max-h-[90vh] overflow-auto">
        <h3 className="text-lg font-semibold mb-5">
          {lead ? "Edit Lead" : "Add Lead"}
        </h3>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              required
              disabled={!!lead}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100"
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.companyName ? `(${customer.companyName})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g. 100 cartons inquiry"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Value (Rs.)</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="MANUAL">Manual</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
                <option value="WEBSITE">Website</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <select
              value={formData.assignedUserId}
              onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 text-white rounded-md transition-colors cursor-pointer ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-400 hover:bg-green-500"
              }`}
            >
              {loading ? "Saving..." : lead ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
