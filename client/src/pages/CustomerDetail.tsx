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
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (!customer) {
    return <div className="text-center py-10 text-gray-500">Customer not found</div>;
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
        className="text-green-500 hover:underline mb-4 inline-block"
      >
        &larr; Back to Customers
      </Link>

      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-semibold">{customer.name}</h2>
          {customer.companyName && (
            <p className="text-gray-500 text-sm mt-1">{customer.companyName}</p>
          )}
        </div>
        <div className="flex gap-2">
          {customer.phone && (
            <a
              href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 text-white rounded-md text-sm no-underline hover:bg-green-600"
            >
              WhatsApp
            </a>
          )}
          {customer.email && (
            <a
              href={`mailto:${customer.email}`}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm no-underline hover:bg-blue-600"
            >
              Email
            </a>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-5 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 bg-transparent border-none cursor-pointer transition-colors ${
              activeTab === tab.id
                ? "font-semibold text-gray-800 border-b-2 border-green-400"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-base font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Phone</span>
                <p className="mt-0.5">{customer.phone || "-"}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Email</span>
                <p className="mt-0.5">{customer.email || "-"}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Address</span>
                <p className="mt-0.5">{customer.address || "-"}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">City</span>
                <p className="mt-0.5">{customer.city || "-"}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Source</span>
                <p className="mt-0.5">{customer.source}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-base font-semibold mb-4">Assigned Agent</h3>
            {customer.assignedUser ? (
              <div>
                <p className="font-medium">{customer.assignedUser.name}</p>
                <p className="text-gray-500 text-sm">{customer.assignedUser.email}</p>
              </div>
            ) : (
              <p className="text-gray-400">Not assigned</p>
            )}
          </div>

          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-base font-semibold mb-4">Recent Tasks</h3>
            {customer.tasks.length > 0 ? (
              <ul className="list-none p-0 m-0 space-y-2">
                {customer.tasks.map((task) => (
                  <li key={task.id} className="pb-2 border-b border-gray-100 text-sm">
                    {task.title}
                    {task.dueDate && (
                      <span className="text-gray-500 ml-2">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No pending tasks</p>
            )}
          </div>

          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-base font-semibold mb-4">Recent Leads</h3>
            {customer.leads.length > 0 ? (
              <ul className="list-none p-0 m-0 space-y-2">
                {customer.leads.map((lead) => (
                  <li key={lead.id} className="pb-2 border-b border-gray-100 text-sm">
                    {lead.title}
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        lead.status === "WON"
                          ? "bg-green-100 text-green-700"
                          : lead.status === "LOST"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No leads yet</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "leads" && (
        <div className="bg-white p-5 rounded-lg">
          {customer.leads.length === 0 ? (
            <p className="text-gray-400 text-center py-5">No leads</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium">Title</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-left py-2 font-medium">Value</th>
                  <th className="text-left py-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {customer.leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100">
                    <td className="py-2">{lead.title}</td>
                    <td className="py-2">{lead.status}</td>
                    <td className="py-2">{lead.value ? `Rs. ${lead.value.toLocaleString()}` : "-"}</td>
                    <td className="py-2">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "conversations" && (
        <div className="bg-white p-5 rounded-lg">
          {customer.conversations.length === 0 ? (
            <p className="text-gray-400 text-center py-5">No conversations</p>
          ) : (
            <div className="space-y-3">
              {customer.conversations.map((conv) => (
                <div key={conv.id} className="pb-3 border-b border-gray-100">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{conv.channel}</span>
                    <span className="text-gray-500 text-xs">
                      {conv.lastMessageAt && new Date(conv.lastMessageAt).toLocaleString()}
                    </span>
                  </div>
                  {conv.messages[0] && (
                    <p className="text-gray-500 text-sm m-0">
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
        <div className="bg-white p-5 rounded-lg">
          {customer.notes.length === 0 ? (
            <p className="text-gray-400 text-center py-5">No notes</p>
          ) : (
            <div className="space-y-3">
              {customer.notes.map((note) => (
                <div key={note.id} className="pb-3 border-b border-gray-100">
                  <p className="m-0 mb-1">{note.content}</p>
                  <span className="text-gray-500 text-xs">
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
