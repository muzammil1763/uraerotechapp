import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { OrdersBarChart, StatusPieChart } from '@/components/Charts'

async function getDashboardData(userId: string) {
  const [orders, quotes] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.quote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  // Get all orders for analytics
  const allOrders = await prisma.order.findMany({
    where: { userId },
    select: { createdAt: true, status: true, total: true }
  })

  // Orders by month (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const recentOrders = allOrders.filter(order => new Date(order.createdAt) >= sixMonthsAgo)
  
  const ordersByMonth = new Map<string, number>()
  recentOrders.forEach(order => {
    const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short' })
    ordersByMonth.set(month, (ordersByMonth.get(month) || 0) + 1)
  })

  const ordersData = Array.from(ordersByMonth.entries()).map(([name, orders]) => ({
    name,
    orders
  }))

  // Orders by status
  const statusCount = new Map<string, number>()
  allOrders.forEach(order => {
    statusCount.set(order.status, (statusCount.get(order.status) || 0) + 1)
  })

  const statusData = Array.from(statusCount.entries()).map(([name, value]) => ({
    name,
    value
  }))

  // Calculate total spent
  const totalSpent = allOrders.reduce((sum, order) => sum + order.total, 0)

  return { orders, quotes, ordersData, statusData, totalSpent }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin')
  }

  const { orders, quotes, ordersData, statusData, totalSpent } = await getDashboardData(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Welcome, {session.user.name}</h1>
            {session.user.role === 'B2B' && (
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                🏢 Business Customer
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            {session.user.role === 'B2B' 
              ? 'Enjoy 10% discount on all products and priority support' 
              : 'Manage your orders and quotes'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-primary-600">{orders.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Pending Quotes</div>
            <div className="text-3xl font-bold text-primary-600">
              {quotes.filter(q => q.status === 'PENDING').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Spent</div>
            <div className="text-3xl font-bold text-green-600">${totalSpent.toFixed(2)}</div>
          </div>
          <div className={`rounded-xl shadow p-6 ${
            session.user.role === 'B2B' ? 'bg-purple-50 border border-purple-200' : 'bg-white'
          }`}>
            <div className="text-sm text-gray-600 mb-2">Account Type</div>
            <div className={`text-3xl font-bold ${
              session.user.role === 'B2B' ? 'text-purple-600' : 'text-primary-600'
            }`}>
              {session.user.role}
            </div>
            {session.user.role === 'B2B' && (
              <div className="text-xs text-purple-600 mt-1">10% discount active</div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Orders Over Time */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders Over Time</h2>
            {ordersData.length > 0 ? (
              <OrdersBarChart data={ordersData} />
            ) : (
              <p className="text-gray-600 text-center py-12">No order data available</p>
            )}
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Status</h2>
            {statusData.length > 0 ? (
              <StatusPieChart data={statusData} />
            ) : (
              <p className="text-gray-600 text-center py-12">No status data available</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">Order #{order.id.slice(-8)}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary-600">${order.total.toFixed(2)}</div>
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.length} item(s)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Recent Quotes</h2>
          </div>
          <div className="p-6">
            {quotes.length === 0 ? (
              <p className="text-gray-600">No quotes yet</p>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{quote.serviceType}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        quote.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        quote.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{quote.message}</p>
                    {quote.adminNotes && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <span className="font-semibold">Admin Note:</span> {quote.adminNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
