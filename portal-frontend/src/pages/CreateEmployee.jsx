import { useState } from "react";
import "./CreateEmployee.css";

export default function CreateEmployee() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "HR",
    gender: "Male",
    course: [],
    image: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        course: checked
          ? [...prev.course, value]
          : prev.course.filter((c) => c !== value),
      }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.mobile.trim()) errs.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(form.mobile)) errs.mobile = "Mobile must be 10 digits";
    if (!form.designation) errs.designation = "Designation is required";
    if (!form.gender) errs.gender = "Gender is required";
    if (form.course.length === 0) errs.course = "Select at least one course";
    if (!form.image) {
      errs.image = "Image is required";
    } else if (!(form.image.type === "image/jpeg" || form.image.type === "image/png")) {
      errs.image = "Only jpg/png allowed";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("mobile", form.mobile);
    formData.append("designation", form.designation);
    formData.append("gender", form.gender);
    form.course.forEach(c => formData.append("course", c));
    formData.append("image", form.image); // Always append, even if null

    try {
      const res = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('Employee created successfully!');
        setForm({
          name: "",
          email: "",
          mobile: "",
          designation: "HR",
          gender: "Male",
          course: [],
          image: null,
        });
        // Also clear the file input value
        const fileInput = document.querySelector('input[type="file"][name="image"]');
        if (fileInput) fileInput.value = "";
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create employee');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  return (
    <div className="create-employee-container">
      <h2 className="create-employee-title">Create Employee</h2>
      <form className="create-employee-form" onSubmit={handleSubmit}>
        <label>Name
          <input type="text" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <div className="error">{errors.name}</div>}
        </label>
        <label>Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <div className="error">{errors.email}</div>}
        </label>
        <label>Mobile No
          <input type="text" name="mobile" value={form.mobile} onChange={handleChange} />
          {errors.mobile && <div className="error">{errors.mobile}</div>}
        </label>
        <label>Designation
          <select name="designation" value={form.designation} onChange={handleChange}>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          {errors.designation && <div className="error">{errors.designation}</div>}
        </label>
        <div className="gender-group">
          <label>Gender</label><br />
          <label><input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} /> Male</label>
          <label><input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} /> Female</label>
          <label><input type="radio" name="gender" value="Other" checked={form.gender === "Other"} onChange={handleChange} /> Other</label>
          {errors.gender && <div className="error">{errors.gender}</div>}
        </div>
        <div className="course-group">
          <label>Course</label><br />
          <label><input type="checkbox" name="course" value="MCA" checked={form.course.includes("MCA")}
            onChange={handleChange} /> MCA</label>
          <label><input type="checkbox" name="course" value="BCA" checked={form.course.includes("BCA")}
            onChange={handleChange} /> BCA</label>
          <label><input type="checkbox" name="course" value="BSC" checked={form.course.includes("BSC")}
            onChange={handleChange} /> BSC</label>
          {errors.course && <div className="error">{errors.course}</div>}
        </div>
        <label>Img Upload
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            onChange={e => {
              const file = e.target.files[0];
              if (file && !["image/jpeg", "image/png"].includes(file.type)) {
                setErrors(prev => ({ ...prev, image: "Only jpg/png allowed" }));
                e.target.value = null;
                setForm(prev => ({ ...prev, image: null }));
              } else {
                setErrors(prev => ({ ...prev, image: undefined }));
                setForm(prev => ({ ...prev, image: file }));
              }
            }}
          />
          {errors.image && <div className="error">{errors.image}</div>}
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}