import { useState, useEffect } from "react";
import api from "../lib/api";
import { Customer } from "../types";

interface CustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
}

const CustomerModal = ({ customer, onClose }: CustomerModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    source: "MANUAL",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        companyName: customer.companyName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        source: customer.source,
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        companyName: formData.companyName || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
      };

      if (customer) {
        await api.put(`/customers/${customer.id}`, payload);
      } else {
        await api.post("/customers", payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save customer");
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
          {customer ? "Edit Customer" : "Add Customer"}
        </h3>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                <option value="OTHER">Other</option>
              </select>
            </div>
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
              {loading ? "Saving..." : customer ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
