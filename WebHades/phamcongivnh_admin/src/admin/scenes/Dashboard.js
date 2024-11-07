import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const data = [
    { month: 'Jan', current: 4000, subscribers: 2400, new: 2400 },
    { month: 'Feb', current: 3000, subscribers: 1398, new: 2210 },
    { month: 'Mar', current: 2000, subscribers: 9800, new: 2290 },
];

const dashboardCards = [
    { title: 'Save Products', value: '50.8K', change: '28.4%', color: 'text-purple-500' },
    { title: 'Stock Products', value: '23.6K', change: '12.6%', color: 'text-red-500' },
    { title: 'Sale Products', value: '756', change: '3.1%', color: 'text-green-500' },
    { title: 'Average Revenue', value: '2.3K', change: '11.3%', color: 'text-green-500' },
];

const colors = ['#8884d8', '#82ca9d', '#ffc658'];

const Dashboard = () => {
    return (
        <div className="bg-gray-900 text-white p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Cards */}
                {dashboardCards.map((card, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="text-lg font-semibold">{card.title}</h2>
                        <p className="text-2xl">{card.value}</p>
                        <p className={`${card.color}`}>{card.change} ↑</p>
                    </div>
                ))}
            </div>

            {/* Website Visitors and Revenue by Customer Type */}
            <div className="flex flex-col md:flex-row gap-6 mt-6">
                {/* Website Visitors */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-1">
                    <h2 className="text-lg font-semibold">Website Visitors</h2>
                    <div className="flex justify-center mt-4">
                        <div className="text-3xl">150K</div>
                        <div className="text-purple-500 ml-2">Export ↓</div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <PieChart width={200} height={200}>
                            <Pie
                                data={[
                                    { name: 'Current', value: 4000 },
                                    { name: 'Subscribers', value: 2400 },
                                    { name: 'New', value: 2400 },
                                ]}
                                cx={100}
                                cy={100}
                                innerRadius={40}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {colors.map((color, index) => (
                                    <Cell key={index} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </div>

                {/* Revenue by Customer Type */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-1">
                    <h2 className="text-lg font-semibold">Revenue by Customer Type</h2>
                    <p className="text-2xl">$240.8K <span className="text-green-500">14.8% ↑</span></p>
                    <LineChart width={600} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="current" stroke={colors[0]} />
                        <Line type="monotone" dataKey="subscribers" stroke={colors[1]} />
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;