import "./Avatar.css";

const COLORS = [
    ["#ede9fe","#6366f1"],
    ["#dcfce7","#16a34a"],
    ["#fef9c3","#a16207"],
    ["#fef2f2","#ef4444"],
    ["#e0f2fe","#0284c7"],
    ["#fce7f3","#be185d"],
    ["#f0fdf4","#15803d"],
    ["#fff7ed","#c2410c"],
];

function colorFor(name = "") {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % COLORS.length;
    return COLORS[Math.abs(h)];
}

function Avatar({ firstName = "", lastName = "", size = "md" }) {
    const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
    const [bg, fg] = colorFor(firstName + lastName);

    return (
        <div
            className={`avatar avatar--${size}`}
            style={{ background: bg, color: fg }}
            title={`${firstName} ${lastName}`}
        >
            {initials || "?"}
        </div>
    );
}

export default Avatar;
