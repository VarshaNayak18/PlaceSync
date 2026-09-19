function AdminSectionNav({ activeSection, onSectionChange }) {
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "companies", label: "Companies" },
    { id: "jobs", label: "Jobs" },
    { id: "applications", label: "Applications" },
    { id: "interviews", label: "Interviews" },
  ];

  return (
    <div className="admin-section-nav">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          className={
            activeSection === section.id
              ? "admin-section-nav-active"
              : ""
          }
          onClick={() => onSectionChange(section.id)}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
}

export default AdminSectionNav;