import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../services/tbaService";

export default function EventSelect() {
const [events, setEvents] = useState([]);
const navigate = useNavigate();

useEffect(() => {
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
  {events.map((event) => (
    <div
      key={event.key}
      style={{
        padding: 10,
        marginBottom: 8,
        background: "#333",
        color: "#fff",
        borderRadius: 6,
        cursor: "pointer"
      }}
      onClick={() => navigate("/matches/" + event.key)}
    >
      {event.name}
    </div>
  ))}
</div>
```

);
}
