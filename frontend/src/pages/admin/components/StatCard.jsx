export default function StatCard({ title, value, percent, icon, color, textColor }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <span className={textColor}>{icon}</span>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <span className={`text-xs ${textColor} font-medium`}>{percent}% ↑</span>
        <span className="text-xs text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  );
} 