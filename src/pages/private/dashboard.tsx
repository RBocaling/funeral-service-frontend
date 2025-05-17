import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { useGetServices } from "@/hooks/controllers/useAddService";
import { useGetBooking } from "@/hooks/controllers/useBooking";
import {
  Bath,
  CircleDollarSign,
  FolderDot,
  Users,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const { data: services }: { data: any[] | undefined } = useGetServices();
  const { data: bookings }: { data: any[] | undefined } = useGetBooking();

  const totalTransactions = bookings?.length || 0;
  const completedTransactions = bookings?.filter((b) => b.bookingStatus === "COMPLETED").length || 0;
  const pendingTransactions = bookings?.filter((b) => b.bookingStatus === "PENDING").length || 0;
  const totalActiveBookings = pendingTransactions;
  const totalCustomers = new Set(bookings?.map((b) => b.customerId)).size || 0;

  const revenueData = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(month => ({ name: month, value: 0 }));

  bookings?.forEach((booking) => {
    if (booking.bookingStatus === "COMPLETED") {
      const month = new Date(booking.createdAt).toLocaleString("default", { month: "short" });
      const revenue = booking.serviceBookings.reduce((acc:any, s:any) => acc + (s.selectedCasketDetail?.price || 0), 0);
      const monthData = revenueData.find(d => d.name === month);
      if (monthData) monthData.value += revenue;
    }
  });

  const bookingsData = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => ({ name: day, value: 0 }));

  bookings?.forEach((booking) => {
    const day = new Date(booking.createdAt).toLocaleString("default", { weekday: "short" });
    const dayData = bookingsData.find(d => d.name === day);
    if (dayData) dayData.value += 1;
  });

  const transactions = [
    { title: "Completed", value: completedTransactions },
    { title: "Pending", value: pendingTransactions },
  ];

  return (
    <div className="container mx-auto px-5 space-y-6">
      <h1 className="text-gradient text-2xl font-bold flex items-center px-2">
        Hello, Juan <img src="/waving.png" className="w-16" alt="" />
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={CircleDollarSign} label="Total Transaction" value={totalTransactions} additional={
          <div className="flex items-center gap-7 mt-5">
            {transactions.map((item, index) => (
              <div key={index} className="relative flex flex-col items-center justify-center">
                <Badge className="absolute -top-4 -right-4 bg-violet-500/10 h-7 w-7 text-violet-500 rounded-full animate-bounce">
                  {item.value}
                </Badge>
                <p className="text-sm font-medium tracking-wide">{item.title}</p>
              </div>
            ))}
          </div>
        } />

        <StatCard icon={FolderDot} label="Total Active Bookings" value={totalActiveBookings} trend="+8.1% from last month" />
        <StatCard icon={Users} label="Total Customer" value={totalCustomers} trend="+15.3% from last month" />
        <StatCard icon={Bath} label="Total Services" value={services?.length || 0} trend="+10.2% from last month" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "0.5rem" }} />
                <Area type="monotone" dataKey="value" stroke="#A855F7" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Bookings */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-6">Weekly Bookings</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "0.5rem" }} />
                <Bar dataKey="value" fill="#0a7efa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-700/30 text-gray-200 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.slice(0, 5).map((booking, index) => {
                const total = booking.serviceBookings.reduce((acc:any, s:any) => acc + (s.selectedCasketDetail?.price || 0), 0);
                return (
                  <tr key={index} className="border-b border-gray-600 hover:bg-gray-700 transition">
                    <td className="px-4 py-3">{`${booking?.customer?.firstName} ${booking?.customer?.lastName }` || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.bookingStatus === "COMPLETED" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">₱ {total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
