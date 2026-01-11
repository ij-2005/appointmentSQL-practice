import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.log("Error fetching appointments list. ", err);
    }
  };

  // Fetch appointments on load
  useEffect(() => {
    fetchAppointments();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    doctor: "",
    date: "",
    time: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/appointments/${id}`, {method: "DELETE",
});

      const data = await res.json();
      console.log(data.message);

      //refresh
      fetchAppointments();
        
    } catch (err){
      console.log("Error deleting appointment.", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Backend SQL: ", data);

      setFormData({
        name: "",
        doctor: "",
        date: "",
        time: "",
      });

      fetchAppointments();
    } catch (err) {
      console.error("Error with submitting.", err);
    }
  };

  return (
    <div className="container">
      <div className="book-appointmentBox">
        <h2>Book Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Your Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="doctor">Doctor:</label>
            <select
              id="doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              <option value="Dr. Smith">Dr. Smith</option>
              <option value="Dr. Lee">Dr. Lee</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="date">Date:</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="time">Time:</label>
            <input
              id="time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Book Appointment</button>
        </form>
      </div>

      <div className="appointmentListBox">
        <h2>Appointment List</h2>

        <div className="search-filter-row">
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">Filter</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="appointment-header">
          <div className="header-cell">Patient</div>
          <div className="header-cell">Doctor</div>
          <div className="header-cell">Date</div>
          <div className="header-cell">Time</div>
        </div>

        <div className="appointment-list-canvas">
          {appointments
            .filter((appt) => {
              const searchMatch =
                appt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appt.doctor.toLowerCase().includes(searchTerm.toLowerCase());

              if (!searchMatch) return false;

              if (filterValue === "") return true;

              const appointmentDate = new Date(appt.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (filterValue === "upcoming") {
                return appointmentDate >= today;
              } else if (filterValue === "past") {
                return appointmentDate < today;
              } else if (filterValue === "all") {
                return true;
              }

              return true;
            })
            .map((appt, index) => (
              <div key={index} className="appointment-row">
                <div>{appt.name}</div>
                <div>{appt.doctor}</div>
                <div>{new Date(appt.date).toLocaleDateString()}</div>
                <div>{appt.time}</div>
              </div>
            ))}
        </div>

        <a href="#" className="view-more-link">
          View More
        </a>
      </div>

      <div className="adminBox">
        <h2>Admin Panel</h2>
        {appointments.map((appt) => (
          <div key={appt.id} className="appointment-row">
            <div>{appt.name}</div>
            <div>{appt.doctor}</div>
            <div>{new Date(appt.date).toLocaleDateString()}</div>
            <div>{appt.time}</div>
            <button onClick={() => deleteAppointment(appt.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
