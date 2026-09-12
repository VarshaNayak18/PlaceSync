function StatusBadge({ status }) {
  const statusStyles = {
  APPLIED: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
  },
  SHORTLISTED: {
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
  },
  REJECTED: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  SELECTED: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
  SCHEDULED: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  COMPLETED: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  CANCELLED: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
};

  const style = statusStyles[status] || {
    backgroundColor: "#e5e7eb",
    color: "#374151",
  };

  return (
    <span
      style={{
        ...style,
        padding: "4px 10px",
        borderRadius: "999px",
        fontWeight: "bold",
        fontSize: "14px",
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;