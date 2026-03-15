import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/tbaService";

export default function EventSelect() {
const navigate = useNavigate();
const [events, setEvents] = useState([]);

useEffect(function () {
async function loadEvents() {
const data = await getEvents(new Date().getFullYear());
if (Array.isArray(data)) {
setEvents(data);
}
}

```
loadEvents();
```

}, []);

return (
<div style={{ padding: 20 }}> <h1>Select Event</h1>

```
  {events.length === 0 && <div>Loading events...</div>}

  {events.map(function (event) {
    return (
      <div
        key={event.key}
        style={{
          padding: 10,
          marginBottom: 10,
          backgroundColor: "#333",
          color: "#ffffff",
          borderRadius: 6,
          cursor: "pointer"
        }}
        onClick={function () {
          navigate("/matches/" + event.key);
        }}
      >
        {event.name}
      </div>
    );
  })}
</div>
```

);
}
