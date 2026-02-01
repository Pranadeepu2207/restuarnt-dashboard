import { useEffect, useState } from "react";
import api from "../services/api";

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);

    const limit = 6; // orders per page

    const fetchOrders = async () => {
        const params = { page, limit };
        if (status) params.status = status;

        const res = await api.get("/orders", { params });
        setOrders(res.data);
    };

    useEffect(() => {
        fetchOrders();
    }, [status, page]);

    const updateStatus = async (id, newStatus) => {
        await api.patch(`/orders/${id}/status`, { status: newStatus });
        fetchOrders();
    };

    const isNextDisabled = orders.length < limit;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Orders Dashboard</h1>

            {/* Status Filter */}
            <select
                className="border p-2 mb-4"
                onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1); // reset page when filter changes
                }}
            >
                <option value="">All</option>
                <option>Pending</option>
                <option>Preparing</option>
                <option>Ready</option>
                <option>Delivered</option>
                <option>Cancelled</option>
            </select>

            {/* Orders List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.length === 0 ? (
                    <p className="text-center col-span-2">No orders found</p>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="border p-4 rounded shadow">
                            <h3 className="font-bold">{order.orderNumber}</h3>
                            <p>{order.customerName}</p>
                            <p>Status: {order.status}</p>

                            <select
                                className="border p-2 mt-2"
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                            >
                                <option>Pending</option>
                                <option>Preparing</option>
                                <option>Ready</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-3 mt-4">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-gray-300"
                        }`}
                >
                    Prev
                </button>

                <span>Page {page}</span>

                <button
                    onClick={() => {
                        if (!isNextDisabled) {
                            setPage(page + 1);
                        }
                    }}
                    disabled={isNextDisabled}
                    className={`px-3 py-1 rounded ${isNextDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-gray-300"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default OrdersPage;
