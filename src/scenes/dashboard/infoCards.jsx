import InfoCard from "./InfoCard";
<div
style={{
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "1rem",
}}
>
{/* Info Card - Total Agents */}
<InfoCard title="Total Agents" data={totalAgents} />

{/* Info Card - Total Items */}
<InfoCard title="Total Items" data={totalItems} />

{/* Info Card - Best Location */}
<InfoCard title="Best Location Item" data={bestLocationItem} />

{/* Info Card - Most Expensive Item */}
<InfoCard title="Most Expensive Item" data={mostExpensiveItem} />
</div>