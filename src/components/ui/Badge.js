export default function Badge({ status, children }) {
    const statusClass = status ? `badge-${status.toLowerCase()}` : '';
    return (
        <span className={`badge ${statusClass}`}>
            {children || status}
        </span>
    );
}
