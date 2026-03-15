import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/tbaService";

function EventSelect() {
const [events, setEvents] = useState([]);
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");

const navigate = useNavigate();

useEffect(function () {
async function load() {
const data = await getEvents(new Date().getFullYear());

```
  if (Array.isArray(data)) {
    const sorted = data.slice().sort(function (a, b) {
      return new Date(a.start_date) - new Date(b.start_date);
    });

    setEvents(sorted);
  }
}

load();
```

}, []);

function getStatus(event) {
const today = new Date();
const start = new Date(event.start_date);
const end = new Date(event.end_date);

```
if (today < start) return "Upcoming";
if (today > end) return "Finished";
return "Active";
```

}

const filteredEvents = events
.filter(function (event) {
return event.name.toLowerCase().includes(search.toLowerCase());
})
.filter(function (event) {
if (filter === "all") return true;
return getStatus(event).toLowerCase() === filter;
});

return (
<div style={{ padding: "30px", maxWidth: "900px" }}> <h1>Select Event</h1>

```
  <input
    type="text"
    placeholder="Search events..."
    value={search}
    onChange={function (e) {
      setSearch(e.target.value);
    }}
    style={{
      padding: "10px",
      width: "100%",
      marginBottom: "15px"
    }}
  />

  <div style={{ marginBottom: "20px" }}>
    <button onClick={function () { setFilter("all"); }}>All</button>
    <button onClick={function () { setFilter("active"); }}>Active</button>
    <button onClick={function () { setFilter("upcoming"); }}>Upcoming</button>
    <button onClick={function () { setFilter("finished"); }}>Finished</button>
  </div>

  {filteredEvents.map(function (event) {
    const status = getStatus(event);

    return (
      <div
        key={event.key}
        onClick={function () {
          navigate("/matches/" + event.key);
        }}
        style={{
          padding: "12px",
          marginBottom: "8px",
          background: "#2c2c2c",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        <div style={{ fontWeight: "bold" }}>
          {event.name}
        </div>

        <div>
          {event.start_date} - {event.end_date}
        </div>

        <div>
          Status: {status}
        </div>
      </div>
    );
  })}
</div>
```

);
}

export default EventSelect;
