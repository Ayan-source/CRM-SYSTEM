import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { CustomerDetail as CustomerDetailType } from "../types";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "conversations" | "notes">("overview");

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/customers/${id}`);
      setCustomer(response.data.data);
    } catch (error) {
      console.error("Failed to fetch customer", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;
  }

  if (!customer) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Customer not found</div>;
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "leads", label: `Leads (${customer._count.leads})` },
    { id: "conversations", label: `Conversations (${customer._count.conversations})` },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div>
      <Link
        to="/customers"
        style={{ color: "#4ade80", textDecoration: "none", marginBottom: "15px", display: "block" }}
      >
        ← Back to Customers
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h2>{customer.name}</h2>
          {customer.companyName && (
            <p style={{ color: "#666", margin: "5px 0 0" }}>{customer.companyName}</p>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {customer.phone && (
            <a
              href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 16px",
                backgroundColor: "#25d366",
                color: "white",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              WhatsApp
            </a>
          )}
          {customer.email && (
            <a
              href={`mailto:${customer.email}`}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4285f4",
                color: "white",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Email
            </a>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #eee" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "10px 20px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #4ade80" : "2px solid transparent",
              cursor: "pointer",
              fontWeight: activeTab === tab.id ? "600" : "400",
              color: activeTab === tab.id ? "#333" : "#666",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>Contact Information</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              <div>
                <span style={{ color: "#666", fontSize: "14px" }}>Phone</span>
                <p style={{ margin: "2px 0 0" }}>{customer.phone || "-"}</p>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: "14px" }}>Email</span>
                <p style={{ margin: "2px 0 0" }}>{customer.email || "-"}</p>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: "14px" }}>Address</span>
                <p style={{ margin: "2px 0 0" }}>{customer.address || "-"}</p>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: "14px" }}>City</span>
                <p style={{ margin: "2px 0 0" }}>{customer.city || "-"}</p>
              </div>
              <div>
                <span style={{ color: "#666", fontSize: "14px" }}>Source</span>
                <p style={{ margin: "2px 0 0" }}>{customer.source}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>Assigned Agent</h3>
            {customer.assignedUser ? (
              <div>
                <p style={{ fontWeight: "500" }}>{customer.assignedUser.name}</p>
                <p style={{ color: "#666", fontSize: "14px" }}>{customer.assignedUser.email}</p>
              </div>
            ) : (
              <p style={{ color: "#999" }}>Not assigned</p>
            )}
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>Recent Tasks</h3>
            {customer.tasks.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {customer.tasks.map((task) => (
                  <li
                    key={task.id}
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                      fontSize: "14px",
                    }}
                  >
                    {task.title}
                    {task.dueDate && (
                      <span style={{ color: "#666", marginLeft: "10px" }}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#999" }}>No pending tasks</p>
            )}
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>Recent Leads</h3>
            {customer.leads.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {customer.leads.map((lead) => (
                  <li
                    key={lead.id}
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                      fontSize: "14px",
                    }}
                  >
                    {lead.title}
                    <span
                      style={{
                        marginLeft: "10px",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        backgroundColor:
                          lead.status === "WON"
                            ? "#dcfce7"
                            : lead.status === "LOST"
                            ? "#fee2e2"
                            : "#dbeafe",
                        color:
                          lead.status === "WON"
                            ? "#16a34a"
                            : lead.status === "LOST"
                            ? "#dc2626"
                            : "#2563eb",
                      }}
                    >
                      {lead.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#999" }}>No leads yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "leads" && (
        <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
          {customer.leads.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No leads</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>Title</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Value</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {customer.leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>{lead.title}</td>
                    <td style={{ padding: "10px" }}>{lead.status}</td>
                    <td style={{ padding: "10px" }}>
                      {lead.value ? `Rs. ${lead.value.toLocaleString()}` : "-"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "conversations" && (
        <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
          {customer.conversations.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No conversations</p>
          ) : (
            <div>
              {customer.conversations.map((conv) => (
                <div
                  key={conv.id}
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontWeight: "500" }}>{conv.channel}</span>
                    <span style={{ color: "#666", fontSize: "12px" }}>
                      {conv.lastMessageAt && new Date(conv.lastMessageAt).toLocaleString()}
                    </span>
                  </div>
                  {conv.messages[0] && (
                    <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
                      {conv.messages[0].content.substring(0, 100)}
                      {conv.messages[0].content.length > 100 && "..."}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "notes" && (
        <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
          {customer.notes.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No notes</p>
          ) : (
            <div>
              {customer.notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: "15px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <p style={{ margin: "0 0 5px" }}>{note.content}</p>
                  <span style={{ color: "#666", fontSize: "12px" }}>
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDetail;
