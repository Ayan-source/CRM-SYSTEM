import { useState, useEffect, useCallback } from "react";
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
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

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
      if (search) params.append("search", search);
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

  const handleEdit = (customer: Customer) => {
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
      WHATSAPP: "#25d366",
      EMAIL: "#4285f4",
      MANUAL: "#6b7280",
      WEBSITE: "#8b5cf6",
      OTHER: "#9ca3af",
    };
    return (
      <span
        style={{
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          color: "white",
          backgroundColor: colors[source] || "#9ca3af",
        }}
      >
        {source}
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Customers</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4ade80",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          + Add Customer
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 15px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          style={{
            padding: "10px 15px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <option value="">All Sources</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="EMAIL">Email</option>
          <option value="MANUAL">Manual</option>
          <option value="WEBSITE">Website</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
      ) : customers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No customers found
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "15px" }}>Name</th>
                <th style={{ padding: "15px" }}>Company</th>
                <th style={{ padding: "15px" }}>Phone</th>
                <th style={{ padding: "15px" }}>Email</th>
                <th style={{ padding: "15px" }}>Source</th>
                <th style={{ padding: "15px" }}>Leads</th>
                <th style={{ padding: "15px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td style={{ padding: "15px" }}>
                    <Link
                      to={`/customers/${customer.id}`}
                      style={{ color: "#333", textDecoration: "none", fontWeight: "500" }}
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td style={{ padding: "15px", color: "#666" }}>
                    {customer.companyName || "-"}
                  </td>
                  <td style={{ padding: "15px", color: "#666" }}>
                    {customer.phone || "-"}
                  </td>
                  <td style={{ padding: "15px", color: "#666" }}>
                    {customer.email || "-"}
                  </td>
                  <td style={{ padding: "15px" }}>
                    {getSourceBadge(customer.source)}
                  </td>
                  <td style={{ padding: "15px", color: "#666" }}>
                    {customer._count.leads}
                  </td>
                  <td style={{ padding: "15px" }}>
                    <button
                      onClick={() => handleEdit(customer)}
                      style={{
                        padding: "5px 10px",
                        marginRight: "5px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
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
        <CustomerModal
          customer={editingCustomer}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Customers;
