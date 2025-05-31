import { useEffect, useState } from "react";


export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/employees`);
        if (res.ok) {
          const data = await res.json();
          setEmployees(data);
        } else {
          setEmployees([]);
        }
      } catch {
        setEmployees([]);
      }
      setLoading(false);
    }
    fetchEmployees();
  }, []);


  // Filter employees by search
  let filteredEmployees = employees.filter(emp => {
    const val = search.toLowerCase();
    return (
      (emp.f_Name || emp.name || '').toLowerCase().includes(val) ||
      (emp.f_Email || emp.email || '').toLowerCase().includes(val) ||
      (emp.f_Designation || emp.designation || '').toLowerCase().includes(val) ||
      (emp.f_Mobile || emp.mobile || '').toLowerCase().includes(val) ||
      (emp.f_gender || emp.gender || '').toLowerCase().includes(val) ||
      (emp.f_Course || emp.course || '').toLowerCase().includes(val)
    );
  });

  // Sorting logic
  if (sortConfig.key) {
    filteredEmployees = [...filteredEmployees].sort((a, b) => {
      let aVal = a[sortConfig.key] || a[`f_${sortConfig.key}`] || '';
      let bVal = b[sortConfig.key] || b[`f_${sortConfig.key}`] || '';
      // For date, try to parse
      if (sortConfig.key.toLowerCase().includes('date')) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // SortArrows component (move outside EmployeeList)

  function SortArrows({ colKey, sortConfig, setSortConfig }) {
    const isActive = sortConfig.key === colKey;
    return (
      <span style={{ marginLeft: 4 }}>
        <button
          style={{
            border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: isActive && sortConfig.direction === 'asc' ? '#1976d2' : '#888', fontSize: '1em'
          }}
          aria-label={`Sort ${colKey} ascending`}
          onClick={e => {
            e.preventDefault();
            setSortConfig(prev => ({ key: colKey, direction: 'asc' }));
          }}
          disabled={isActive && sortConfig.direction === 'asc'}
          tabIndex={-1}
        >&#9650;</button>
        <button
          style={{
            border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: isActive && sortConfig.direction === 'desc' ? '#1976d2' : '#888', fontSize: '1em'
          }}
          aria-label={`Sort ${colKey} descending`}
          onClick={e => {
            e.preventDefault();
            setSortConfig(prev => ({ key: colKey, direction: 'desc' }));
          }}
          disabled={isActive && sortConfig.direction === 'desc'}
          tabIndex={-1}
        >&#9660;</button>
      </span>
    );
  }

  return (
    <div style={{ justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      {/* Top bar with total count and create button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontWeight: 500, fontSize: '1.1em', marginRight: 16 }}>
          Total Count: {employees.length}
        </span>
        <button onClick={() => window.location.href = "/create"} style={{ padding: '6px 16px', fontWeight: 500 }}>
          Create Employee
        </button>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search by name, email, designation, etc."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 320, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
        />
      </div>

      {/* Employee Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ alignSelf: 'center', width: '90vw', overflowX: 'auto' }}>
          <table border="1" cellPadding={10} style={{ minWidth: 900, width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
              <th>
                Unique Id
                <SortArrows colKey="Id" sortConfig={sortConfig} setSortConfig={setSortConfig} />
              </th>
              <th>Image</th>
              <th>
                Name
                <SortArrows colKey="Name" sortConfig={sortConfig} setSortConfig={setSortConfig} />
              </th>
              <th>
                Email
                <SortArrows colKey="Email" sortConfig={sortConfig} setSortConfig={setSortConfig} />
              </th>
              <th>
                Mobile No
                <SortArrows colKey="Mobile" sortConfig={sortConfig} setSortConfig={setSortConfig} />
              </th>
              <th>
                Designation
                <SortArrows colKey="Designation" sortConfig={sortConfig} setSortConfig={setSortConfig} />
              </th>
              <th>
                Gender
                <SortArrows colKey="gender" sortConfig={sortConfig} setSortConfig={setSortConfig} />
              </th>
              <th>
                Course
                <SortArrows colKey="Course" sortConfig={sortConfig} setSortConfig={setSortConfig} />
              </th>
              <th>
                Create date
                <SortArrows colKey="Createdate" sortConfig={sortConfig} setSortConfig={setSortConfig} />
              </th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr><td colSpan={10} style={{textAlign: 'center'}}>No employees found</td></tr>
            ) : (
              filteredEmployees.map(emp => (
                <tr key={emp.id || emp.f_Id}>
                  <td>{emp.id || emp.f_Id}</td>
                  <td>
                    {emp.image || emp.f_Image ? (
                      <img src={emp.image || emp.f_Image} alt={emp.name || emp.f_Name} width={32} height={32} style={{ objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{emp.name || emp.f_Name}</td>
                  <td>{emp.email || emp.f_Email}</td>
                  <td>{emp.mobile || emp.f_Mobile}</td>
                  <td>{emp.designation || emp.f_Designation}</td>
                  <td>{emp.gender || emp.f_gender}</td>
                  <td>{emp.course || emp.f_Course}</td>
                  <td>{emp.createdate || emp.f_Createdate}</td>
                  <td>
                    <button onClick={() => window.location.href = `/edit/${emp.id || emp.f_Id}`}>Edit</button>
                    <button
                      onClick={async () => {
                        if (!window.confirm('Are you sure you want to delete this employee?')) return;
                        const empId = emp.id || emp.f_Id;
                        try {
                          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
                          const res = await fetch(`${API_URL}/api/employees/${empId}` , { method: 'DELETE' });
                          if (res.ok) {
                            alert('Employee deleted successfully!');
                            setEmployees(prev => prev.filter(e => (e.id || e.f_Id) !== empId));
                          } else {
                            const data = await res.json();
                            alert(data.message || 'Failed to delete employee');
                          }
                        } catch {
                          alert('Server error');
                        }
                      }}
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      )}
    </div>
  );
}