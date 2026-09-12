function StatCard({ title, value }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <p
        style={{
          marginBottom: "8px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "30px",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default StatCard;