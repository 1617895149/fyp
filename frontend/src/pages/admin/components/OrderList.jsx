export default function OrderList({ orders }) {
    return (
      <div className="overflow-x-auto w-[100%]">
        <table className="min-w-full bg-white w-[100%]">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-600 text-sm">
              <th className="py-3 px-6 font-medium">No</th>
              <th className="py-3 px-6 font-medium">Order ID</th>
              <th className="py-3 px-6 font-medium">Orderer Name</th>
              <th className="py-3 px-6 font-medium">Date</th>
              <th className="py-3 px-6 font-medium">Cost</th>
              <th className="py-3 px-6 font-medium">Shipping Cost</th>
              <th className="py-3 px-6 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={order.id} className="hover:bg-red-600">
                <td className="py-4 px-6">{index + 1}</td>
                <td className="py-4 px-6 text-gray-800">{order.id}</td>
                <td className="py-4 px-6">{order.name}</td>
                <td className="py-4 px-6 text-gray-500">{order.date}</td>
                <td className="py-4 px-6">${order.cost.toFixed(2)}</td>
                <td className="py-4 px-6">${order.shippingCost.toFixed(2)}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }