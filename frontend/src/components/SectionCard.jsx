function SectionCard({ title, children }) {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        marginBottom: "24px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>
        {title}
      </h2>

      {children}
    </section>
  );
}

export default SectionCard;