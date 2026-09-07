import { useState, useEffect } from "react";
import api from "../lib/api";
import LeadModal from "../components/LeadModal";
import { Lead, PipelineStage } from "../types";

const Leads = () => {
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [view, setView] = useState<"pipeline" | "list">("pipeline");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchPipeline();
    fetchLeads();
  }, [statusFilter, debouncedSearch]);

  const fetchPipeline = async () => {
    try {
      const response = await api.get("/leads/pipeline");
      setPipeline(response.data.data);
    } catch (error) {
      console.error("Failed to fetch pipeline", error);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (debouncedSearch) params.append("search", debouncedSearch);

      const response = await api.get(`/leads?${params.toString()}`);
      setLeads(response.data.data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStage = async (leadId: string, stageId: string) => {
    try {
      await api.patch(`/leads/${leadId}/stage`, { stageId });
      fetchLeads();
      fetchPipeline();
    } catch (error) {
      console.error("Failed to move lead", error);
    }
  };

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      await api.patch(`/leads/${leadId}/status`, { status });
      fetchLeads();
      fetchPipeline();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
      fetchPipeline();
    } catch (error) {
      console.error("Failed to delete lead", error);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingLead(null);
    fetchLeads();
    fetchPipeline();
  };

  const getLeadsForStage = (stageId: string) => {
    return leads.filter((lead) => lead.pipelineStageId === stageId && lead.status === "OPEN");
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: "bg-blue-100 text-blue-700",
      WON: "bg-green-100 text-green-700",
      LOST: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs ${colors[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Leads</h2>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setView("pipeline")}
              className={`px-3 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                view === "pipeline" ? "bg-white shadow-sm font-medium" : "text-gray-500"
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                view === "list" ? "bg-white shadow-sm font-medium" : "text-gray-500"
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-green-400 text-white rounded-md font-medium hover:bg-green-500 transition-colors cursor-pointer"
          >
            + Add Lead
          </button>
        </div>
      </div>

      {view === "list" && (
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : view === "pipeline" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipeline.map((stage) => {
            const stageLeads = getLeadsForStage(stage.id);
            const totalValue = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

            return (
              <div
                key={stage.id}
                className="flex-shrink-0 w-72 bg-gray-50 rounded-lg p-3"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-sm text-gray-700">{stage.name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>

                {totalValue > 0 && (
                  <div className="text-xs text-gray-500 mb-3">
                    Rs. {totalValue.toLocaleString()}
                  </div>
                )}

                <div className="space-y-2 min-h-[100px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleEdit(lead)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-gray-800">{lead.title}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {lead.customer.name}
                        {lead.customer.companyName && ` - ${lead.customer.companyName}`}
                      </div>
                      {lead.value && (
                        <div className="text-sm font-medium text-green-600 mb-2">
                          Rs. {lead.value.toLocaleString()}
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        {lead.assignedUser && (
                          <span className="text-xs text-gray-400">
                            {lead.assignedUser.name}
                          </span>
                        )}
                        <div className="flex gap-1">
                          {stage.id !== "won" && (
                            <select
                              value=""
                              onChange={(e) => {
                                e.stopPropagation();
                                if (e.target.value === "WON" || e.target.value === "LOST") {
                                  handleStatusChange(lead.id, e.target.value);
                                } else if (e.target.value) {
                                  handleMoveStage(lead.id, e.target.value);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs border border-gray-200 rounded px-1 py-0.5 cursor-pointer"
                            >
                              <option value="">Move...</option>
                              {pipeline
                                .filter((s) => s.id !== stage.id && s.id !== "won")
                                .map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name}
                                  </option>
                                ))}
                              <option value="WON">Mark Won</option>
                              <option value="LOST">Mark Lost</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          {leads.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No leads found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Assigned</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium">{lead.title}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {lead.customer.name}
                      {lead.customer.companyName && (
                        <span className="text-xs ml-1">({lead.customer.companyName})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {lead.pipelineStage?.name || "-"}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(lead.status)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {lead.value ? `Rs. ${lead.value.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {lead.assignedUser?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(lead)}
                        className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded cursor-pointer hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded cursor-pointer hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showModal && (
        <LeadModal lead={editingLead} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Leads;
