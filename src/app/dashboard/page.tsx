"use client";
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { error } from 'console';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';


interface Order {
    _id : string;
    firstName : string;
    lastName : string;
    phone :number;
    email : string;
    address : string;
    city : string;
    ZipCode : string;
    total : number;
    discount : number;
    orderDate : string;
    status : string | null;
    cartItems : {productName: string; image: string}[];
}

const AdminDashboard = () => {

    const [orders , setOrders] = useState<Order[]>([])
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [filter, setFilter] = useState("All")

    useEffect(() => {
        client.fetch(
            `*[_type == "order"]{
            _id,
            firstName,
            lastName,
            phone,
            email,
            address,
            city,
            zipCode,
            total,
            discount,
            orderDate,
            status,
            cartItems[]->{
            productName,
            image
            }
            }`
        )
        .then((data) => setOrders(data))
        .catch((error) => console.log("error fetching products", error))
    },[])

    //functionality
    const filterOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter )
    //toggle order details
    const toggleOrderDetails = (orderId :string) => {
        setSelectedOrderId((prev) => (prev === orderId ? null : orderId))}
       
        //handle remove item
  
    const handleDeleteItem = async (orderId: string) => {
        console.log("Deleting order with ID:", orderId); 
    
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        });
    
        if (!result.isConfirmed) return;
    
        try {
            const response = await client.delete(orderId);  
            console.log("Delete Response:", response); // Check if the API call is successful
    
            // Check if response indicates success
            if (response && response.success) {
                setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
                await Swal.fire("Deleted!", "Your order has been deleted", "success");
            } else {
                throw new Error("Delete operation failed");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            await Swal.fire("Error!", "There was an error deleting the order", "error");
        }
    };
    


    //order status

    const handleStatusChange = async (orderId: string , newStatus: string) => {
        try {
            await client
            .patch(orderId)
            .set({status: newStatus})
            .commit()
            setOrders((prevOrders) => prevOrders.map((order) => order._id === orderId ? {
                ...order,
                 status: newStatus
                } : order)
            )
            if(newStatus === "dispatch"){
                Swal.fire("Order Dispatched!", "Order has been dispatched", "success")
            } else if(newStatus === "success") {
            Swal.fire("Success","Your order has been completed", "success")
        }    
    }catch(_error) { 
        console.error("Error changing order status:", error);
        Swal.fire("Error!", "Failed to change status", "error");
    }
    };
  return (
        <ProtectedRoute>
            <div className='flex flex-col h-screen bg-gray-100'>
    {/* Navbar */}
    <nav className='bg-red-600 text-white p-4 shadow-lg flex flex-wrap justify-between items-center'>
        <h2 className='text-xl sm:text-2xl font-bold'>Admin Dashboard</h2>
        <div className='flex flex-wrap gap-2 sm:gap-4'>
            {["All", "pending", "success", "dispatch"].map((status) => (
                <button
                    key={status}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
                        filter === status ? "bg-white text-red-600 font-bold" : "text-white"
                    }`}
                    onClick={() => setFilter(status)}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
            ))}
        </div>
    </nav>

    {/* Orders Table */}
    <div className='flex-1 p-4 sm:p-6 overflow-y-auto'>
        <h2 className='text-xl sm:text-2xl font-bold mb-4 text-center'>Orders</h2>
        <div className='overflow-x-auto bg-white rounded-lg shadow-lg'>
            <table className='min-w-full divide-y divide-gray-200 text-xs sm:text-sm md:text-base'>
                <thead className='bg-gray-50 text-red-600'>
                    <tr>
                        <th className='px-2 py-2 sm:px-4 sm:py-3'>ID</th>
                        <th className='px-2 py-2 sm:px-4 sm:py-3'>Customer</th>
                        <th className='px-2 py-2 sm:px-4 sm:py-3'>Address</th>
                        <th className='px-2 py-2 sm:px-4 sm:py-3'>Date</th>
                        <th className='px-2 py-2 sm:px-4 sm:py-3'>Total</th>
                        <th className='px-2 py-2 sm:px-4 sm:py-3'>Status</th>
                        <th className='px-2 py-2 sm:px-4 sm:py-3'>Actions</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {filterOrders.map((order) => (
                        <React.Fragment key={order._id}>
                            <tr className='cursor-pointer hover:bg-red-100 transition-all' onClick={() => toggleOrderDetails(order._id)}>
                                <td className='px-2 py-2 sm:px-4 sm:py-3'>{order._id}</td>
                                <td className='px-2 py-2 sm:px-4 sm:py-3'>{order.firstName} {order.lastName}</td>
                                <td className='px-2 py-2 sm:px-4 sm:py-3'>{order.address}</td>
                                <td className='px-2 py-2 sm:px-4 sm:py-3'>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className='px-2 py-2 sm:px-4 sm:py-3'>${order.total}</td>
                                <td>
                                    <select 
                                        value={order.status || ""} 
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className='bg-gray-100 p-1 rounded text-xs sm:text-sm'
                                    >
                                        <option value='pending'>Pending</option>
                                        <option value='success'>Success</option>
                                        <option value='dispatch'>Dispatch</option>
                                    </select>
                                </td>
                                <td className='px-2 py-2 sm:px-4 sm:py-3'>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteItem(order._id);
                                        }} 
                                        className='bg-red-500 text-white py-1 px-2 sm:px-3 sm:py-1 rounded hover:bg-red-800 transition'
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            {selectedOrderId === order._id && (
                                <tr>
                                    <td colSpan={7} className='bg-gray-50 p-3 sm:p-4 transition-all animate-fadeIn'>
                                        <h3 className='font-bold'>Order Details</h3>
                                        <p><strong>Phone:</strong> {order.phone}</p>
                                        <p><strong>Email:</strong> {order.email}</p>
                                        <p><strong>City:</strong> {order.city}</p>
                                        <ul>
                                            {order.cartItems.map((item) => (
                                                <li key={`${order._id}`} className='flex items-center gap-2 text-xs sm:text-sm'>
                                                    {item.productName}
                                                    {item.image && (
                                                        <Image 
                                                            src={urlFor(item.image).url()}
                                                            alt={item.productName}
                                                            width={60} height={60}
                                                            className='rounded-md'
                                                        />
                                                    )}      
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
</div>

        </ProtectedRoute>   
  )
}

export default AdminDashboard