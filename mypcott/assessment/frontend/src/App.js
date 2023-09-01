import './App.css';
import { useEffect, useState } from 'react';
import axios from "axios";
import Formtable from './components/Formtable';

axios.defaults.baseURL = "http://localhost:8080/"

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    name: "",
    email: "",
    mobile: "",
    _id: ""
  });
  const [dataList, setDataList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // State variable to store selected IDs
  const [filter, setFilter] = useState("all"); // Filter: all, active, inactive
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering by name

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await axios.post("/create", formData);
    if (data.data.success) {
      setAddSection(false);
      alert(data.data.message);
      getFetchData();
      setFormData({
        name: "",
        email: "",
        mobile: ""
      });
    }
  }

  const getFetchData = async () => {
    const data = await axios.get("/");
    if (data.data.success) {
      setDataList(data.data.data.map(record => ({ ...record, active: record.active }))); // Preserve active status
    }
  }

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    const data = await axios.delete("/delete/" + id);

    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put("/update", formDataEdit);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
      setEditSection(false);
    }
  }

  const handleEditOnChange = async (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  }

  const toggleSelect = (id) => {
    // Toggle the selection state of a record
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  const isRecordSelected = (id) => {
    // Check if a record is selected
    return selectedIds.includes(id);
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one record to delete.");
      return;
    }

    try {
      const response = await axios.post("/delete/bulk", { ids: selectedIds });
      if (response.data.success) {
        getFetchData(); // Refresh the data after bulk delete
        setSelectedIds([]); // Clear the selected IDs after bulk delete
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error performing bulk delete: ", error);
    }
  };

  const toggleActive = async (id) => {
    // Toggle the active status of a record
    const data = await axios.put("/update", { _id: id, active: !isActive(id) });
    if (data.data.success) {
      getFetchData();
    }
  };

  const isActive = (id) => {
    const record = dataList.find((record) => record._id === id);
    return record ? record.active : false;
  };

  // Filter the records based on the selected filter and search query
  const filteredDataList = dataList.filter((el) => {
    if (filter === "all") {
      return el.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filter === "active") {
      return el.active && el.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filter === "inactive") {
      return !el.active && el.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>
        <button className="btn btn-delete" onClick={handleBulkDelete}>Bulk Delete</button>
        <div className="filter-container">
          <label>Filter by:</label>
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {
          addSection && (
            <Formtable
              handleSubmit={handleSubmit}
              handleOnChange={handleOnChange}
              handleclose={() => setAddSection(false)}
              rest={formData}
            />
          )
        }
        {
          editSection && (
            <Formtable
              handleSubmit={handleUpdate}
              handleOnChange={handleEditOnChange}
              handleclose={() => setEditSection(false)}
              rest={formDataEdit}
            />
          )
        }
        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Active/Inactive</th> {/* Add a column for active/inactive toggle */}
                <th>Select</th> {/* Add a column for checkboxes */}
              </tr>
            </thead>
            <tbody>
              {filteredDataList[0] ? (
                filteredDataList.map((el) => {
                  return (
                    <tr key={el._id}>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.mobile}</td>
                      <td>
                        <button className='btn' onClick={() => toggleActive(el._id)}>
                          {el.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isRecordSelected(el._id)}
                          onChange={() => toggleSelect(el._id)}
                        />
                      </td>
                      <td>
                        <button className='btn btn-edit' onClick={() => handleEdit(el)}>Edit</button>
                        <button className='btn btn-delete' onClick={() => handleDelete(el._id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
