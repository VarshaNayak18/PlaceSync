import { useEffect, useState } from "react";
import {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
} from "../services/studentService";
import { useAuth } from "../context/AuthContext";

function StudentProfilePage() {
  const { user } = useAuth();

  const [student, setStudent] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    usn: "",
    department: "",
    cgpa: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();

        setStudent(data);
        setProfileMissing(false);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          usn: data.usn || "",
          department: data.department || "",
          cgpa: data.cgpa ?? "",
          phoneNumber: data.phoneNumber || "",
        });
      } catch (error) {
        console.error("Failed to fetch student profile:", error);

        if (error.response?.status === 404) {
          setProfileMissing(true);

          setFormData({
            name: user?.name || "",
            email: user?.email || "",
            usn: "",
            department: "",
            cgpa: "",
            phoneNumber: "",
          });
        } else {
          setError(
            error.response?.data?.message ||
              "Failed to load your profile."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateProfile = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const createdStudent = await createStudentProfile({
        ...formData,
        cgpa: Number(formData.cgpa),
      });

      setStudent(createdStudent);
      setProfileMissing(false);

      setFormData({
        name: createdStudent.name,
        email: createdStudent.email,
        usn: createdStudent.usn,
        department: createdStudent.department,
        cgpa: createdStudent.cgpa,
        phoneNumber: createdStudent.phoneNumber,
      });

      setSuccess("Profile created successfully.");
    } catch (error) {
      console.error("Failed to create profile:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updatedStudent = await updateStudentProfile({
        ...formData,
        cgpa: Number(formData.cgpa),
      });

      setStudent(updatedStudent);
      setEditing(false);

      setFormData({
        name: updatedStudent.name,
        email: updatedStudent.email,
        usn: updatedStudent.usn,
        department: updatedStudent.department,
        cgpa: updatedStudent.cgpa,
        phoneNumber: updatedStudent.phoneNumber,
      });

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
    setSuccess("");

    setFormData({
      name: student.name || "",
      email: student.email || "",
      usn: student.usn || "",
      department: student.department || "",
      cgpa: student.cgpa ?? "",
      phoneNumber: student.phoneNumber || "",
    });
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-message">
            Loading your profile...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Page Header */}
        <div className="dashboard-header">
          <p className="dashboard-eyebrow">
            Student Portal
          </p>

          <h1>My Profile</h1>

          <p>
            Manage your academic and contact information.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* Create Profile */}
        {profileMissing && (
          <div className="section-card profile-card">

            <div className="profile-card-heading">
              <div className="profile-avatar profile-avatar-warning">
                !
              </div>

              <div>
                <h2>Complete Your Profile</h2>

                <p>
                  Add your academic and contact details
                  to start using the placement portal.
                </p>
              </div>
            </div>

            <form
              className="student-profile-form"
              onSubmit={handleCreateProfile}
            >
              <div className="student-profile-form-grid">

                <ProfileInput
                  id="profile-name"
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="profile-email"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="profile-usn"
                  label="USN"
                  name="usn"
                  placeholder="e.g. 1PL23CS001"
                  value={formData.usn}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="profile-department"
                  label="Department"
                  name="department"
                  placeholder="e.g. CSE"
                  value={formData.department}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="profile-cgpa"
                  label="CGPA"
                  name="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="e.g. 8.75"
                  value={formData.cgpa}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="profile-phone"
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="10-digit phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

              </div>

              <div className="profile-actions">
                <button
                  className="primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Creating Profile..."
                    : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Profile */}
        {!profileMissing && student && !editing && (
          <div className="section-card profile-card">

            <div className="profile-card-heading">
              <div className="profile-avatar">
                {student.name
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}
              </div>

              <div>
                <h2>{student.name}</h2>

                <p>
                  {student.department} • {student.usn}
                </p>
              </div>
            </div>

            <div className="student-profile-details">

              <ProfileDetail
                label="Full Name"
                value={student.name}
              />

              <ProfileDetail
                label="Email"
                value={student.email}
              />

              <ProfileDetail
                label="USN"
                value={student.usn}
              />

              <ProfileDetail
                label="Department"
                value={student.department}
              />

              <ProfileDetail
                label="CGPA"
                value={student.cgpa}
              />

              <ProfileDetail
                label="Phone Number"
                value={student.phoneNumber}
              />

            </div>

            <div className="profile-actions">
              <button
                className="primary-button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>

          </div>
        )}

        {/* Edit Profile */}
        {!profileMissing && student && editing && (
          <div className="section-card profile-card">

            <div className="profile-form-header">
              <h2>Edit Profile</h2>

              <p>
                Update your academic and contact information.
              </p>
            </div>

            <form
              className="student-profile-form"
              onSubmit={handleUpdateProfile}
            >
              <div className="student-profile-form-grid">

                <ProfileInput
                  id="edit-name"
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="edit-email"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="edit-usn"
                  label="USN"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="edit-department"
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="edit-cgpa"
                  label="CGPA"
                  name="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={handleChange}
                />

                <ProfileInput
                  id="edit-phone"
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

              </div>

              <div className="profile-actions">
                <button
                  className="primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </main>
  );
}

function ProfileInput({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}) {
  return (
    <div className="student-form-group">
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required
      />
    </div>
  );
}

function ProfileDetail({ label, value }) {
  return (
    <div className="profile-detail">
      <span>{label}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}

export default StudentProfilePage;