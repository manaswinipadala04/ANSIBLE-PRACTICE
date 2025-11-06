import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';


const HospitalManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState({
    id: '',
    name: '',
    age: '',
    gender: '',
    specialization: '',
    phoneNumber: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedDoctor, setFetchedDoctor] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/doctorapi`;


  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setDoctors(res.data);
    } catch (error) {
      setMessage('Failed to fetch doctors.');
    }
  };

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in doctor) {
      if (!doctor[key] || doctor[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addDoctor = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, doctor);
      setMessage('Doctor added successfully.');
      fetchAllDoctors();
      resetForm();
    } catch (error) {
      setMessage('Error adding doctor.');
    }
  };

  const updateDoctor = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, doctor);
      setMessage('Doctor updated successfully.');
      fetchAllDoctors();
      resetForm();
    } catch (error) {
      setMessage('Error updating doctor.');
    }
  };

  const deleteDoctor = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllDoctors();
    } catch (error) {
      setMessage('Error deleting doctor.');
    }
  };

  const getDoctorById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedDoctor(res.data);
      setMessage('');
    } catch (error) {
      setFetchedDoctor(null);
      setMessage('Doctor not found.');
    }
  };

  const handleEdit = (doc) => {
    setDoctor(doc);
    setEditMode(true);
    setMessage(`Editing doctor with ID ${doc.id}`);
  };

  const resetForm = () => {
    setDoctor({
      id: '',
      name: '',
      age: '',
      gender: '',
      specialization: '',
      phoneNumber: ''
    });
    setEditMode(false);
  };

  return (
    <div className="doctor-container">

      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>Hospital Management System - Doctor Module</h2>

      <div>
        <h3>{editMode ? 'Edit Doctor' : 'Add Doctor'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={doctor.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Name" value={doctor.name} onChange={handleChange} />
          <input type="number" name="age" placeholder="Age" value={doctor.age} onChange={handleChange} />
          <select name="gender" value={doctor.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
          <input type="text" name="specialization" placeholder="Specialization" value={doctor.specialization} onChange={handleChange} />
          <input type="text" name="phoneNumber" placeholder="Phone Number" value={doctor.phoneNumber} onChange={handleChange} />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addDoctor}>Add Doctor</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateDoctor}>Update Doctor</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Doctor By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter Doctor ID"
        />
        <button className="btn-blue" onClick={getDoctorById}>Fetch</button>

        {fetchedDoctor && (
          <div>
            <h4>Doctor Found:</h4>
            <pre>{JSON.stringify(fetchedDoctor, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Doctors</h3>
        {doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(doctor).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    {Object.keys(doctor).map((key) => (
                      <td key={key}>{doc[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(doc)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteDoctor(doc.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default HospitalManagement;
