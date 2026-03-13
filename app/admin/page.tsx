import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { MultiLineChart, StatusPieChart, RevenueBarChart } from '@/components/Charts'

async function getAdminStats() {
  const [totalProducts, totalOrders, pendingQuotes, totalUsers] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.quote.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { role: { not: 'ADMIN' } } })
  ])

  const recentOrders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  const recentQuotes = await prisma.quote.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  // Get orders by status for pie chart
  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    _count: { status: true }
  })

  // Get revenue by month for last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const ordersWithDates = await prisma.order.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true, total: true }
  })

  // Process monthly revenue
  const monthlyRevenue = new Map<string, number>()
  ordersWithDates.forEach(order => {
    const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + order.total)
  })

  const revenueData = Array.from(monthlyRevenue.entries()).map(([name, revenue]) => ({
    name,
    revenue: Math.round(revenue)
  }))

  // Get activity trends (orders, quotes, users) by month
  const quotesWithDates = await prisma.quote.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true }
  })

  const usersWithDates = await prisma.user.findMany({
    where: { 
      createdAt: { gte: sixMonthsAgo },
      role: { not: 'ADMIN' }
    },
    select: { createdAt: true }
  })

  const activityByMonth = new Map<string, { orders: number, quotes: number, users: number }>()
  
  ordersWithDates.forEach(order => {
    const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short' })
    const current = activityByMonth.get(month) || { orders: 0, quotes: 0, users: 0 }
    activityByMonth.set(month, { ...current, orders: current.orders + 1 })
  })

  quotesWithDates.forEach(quote => {
    const month = new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short' })
    const current = activityByMonth.get(month) || { orders: 0, quotes: 0, users: 0 }
    activityByMonth.set(month, { ...current, quotes: current.quotes + 1 })
  })

  usersWithDates.forEach(user => {
    const month = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short' })
    const current = activityByMonth.get(month) || { orders: 0, quotes: 0, users: 0 }
    activityByMonth.set(month, { ...current, users: current.users + 1 })
  })

  const activityData = Array.from(activityByMonth.entries()).map(([name, data]) => ({
    name,
    ...data
  }))

  const statusData = ordersByStatus.map(item => ({
    name: item.status,
    value: item._count.status
  }))

  return {
    totalProducts,
    totalOrders,
    pendingQuotes,
    totalUsers,
    recentOrders,
    recentQuotes,
    statusData,
    revenueData,
    activityData
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Products</div>
            <div className="text-3xl font-bold text-primary-600">{stats.totalProducts}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-primary-600">{stats.totalOrders}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Pending Quotes</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingQuotes}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Users</div>
            <div className="text-3xl font-bold text-primary-600">{stats.totalUsers}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/admin/products" 
              className="bg-primary-500 text-white px-6 py-3 rounded-lg text-center hover:bg-primary-600 transition">
              Manage Products
            </Link>
            <Link href="/admin/orders" 
              className="bg-primary-500 text-white px-6 py-3 rounded-lg text-center hover:bg-primary-600 transition">
              Manage Orders
            </Link>
            <Link href="/admin/quotes" 
              className="bg-primary-500 text-white px-6 py-3 rounded-lg text-center hover:bg-primary-600 transition">
              Manage Quotes
            </Link>
            <Link href="/admin/users" 
              className="bg-primary-500 text-white px-6 py-3 rounded-lg text-center hover:bg-primary-600 transition">
              Manage Users
            </Link>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Trends */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Trends</h2>
            <MultiLineChart data={stats.activityData} />
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Status Distribution</h2>
            <StatusPieChart data={stats.statusData} />
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Revenue</h2>
          <RevenueBarChart data={stats.revenueData} />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm">#{order.id.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm">{order.user.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Recent Quote Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentQuotes.map((quote) => (
                  <tr key={quote.id}>
                    <td className="px-6 py-4 text-sm">{quote.name}</td>
                    <td className="px-6 py-4 text-sm">{quote.serviceType}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        quote.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        quote.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(quote.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
