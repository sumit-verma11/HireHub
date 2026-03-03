export default function Card({ children, className = '', hover = false, onClick }) {
    return (
        <div
            className={`glass-sm ${hover ? 'glass-hover cursor-pointer' : ''} p-5 ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
