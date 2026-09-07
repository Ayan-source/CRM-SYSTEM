import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import CustomerModal from "../components/CustomerModal";
import { CustomerListItem } from "../types";

const Customers = () => {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerListItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch, sourceFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (sourceFilter) params.append("source", sourceFilter);

      const response = await api.get(`/customers?${params.toString()}`);
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer", error);
    }
  };

  const handleEdit = (customer: CustomerListItem) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCustomer(null);
    fetchCustomers();
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      WHATSAPP: "bg-green-500",
      EMAIL: "bg-blue-500",
      MANUAL: "bg-gray-500",
      WEBSITE: "bg-purple-500",
      OTHER: "bg-gray-400",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs text-white ${colors[source] || "bg-gray-400"}`}>
        {source}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Customers</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-green-400 text-white rounded-md font-medium hover:bg-green-500 transition-colors cursor-pointer"
        >
          + Add Customer
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Sources</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="EMAIL">Email</option>
          <option value="MANUAL">Manual</option>
          <option value="WEBSITE">Website</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : customers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No customers found</div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Leads</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="text-gray-800 font-medium hover:text-green-500 no-underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{customer.companyName || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{customer.phone || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{customer.email || "-"}</td>
                  <td className="px-4 py-3">{getSourceBadge(customer.source)}</td>
                  <td className="px-4 py-3 text-gray-500">{customer._count.leads}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded cursor-pointer hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="px-3 py-1.5 bg-red-500 text-white text-sm rounded cursor-pointer hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CustomerModal customer={editingCustomer} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Customers;
