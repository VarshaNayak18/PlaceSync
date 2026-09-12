function AdminSectionNav() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "24px",
        padding: "12px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
      }}
    >
      <button onClick={() => scrollToSection("overview")}>
        Overview
      </button>

      <button onClick={() => scrollToSection("companies")}>
        Companies
      </button>

      <button onClick={() => scrollToSection("jobs")}>
        Jobs
      </button>

      <button onClick={() => scrollToSection("applications")}>
        Applications
      </button>

      <button onClick={() => scrollToSection("interviews")}>
        Interviews
      </button>
    </div>
  );
}

export default AdminSectionNav;