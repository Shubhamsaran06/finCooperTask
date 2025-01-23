import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast"; // For toast notifications
import './View.css'

export default function ViewCustomer() {
  const router = useRouter();
  const { id } = router.query;
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (id) {
      async function fetchCustomer() {
        const response = await fetch(`http://localhost:5000/customer/${id}`);
        const data = await response.json();
        setCustomer(data);
      }
      fetchCustomer();
    }
  }, [id]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/customer/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Customer deleted successfully!");
        router.push("/customers");
      } else {
        throw new Error("Failed to delete customer.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="view-customer-container">
      <Toaster />
      <h1 className="customer-heading">Customer Details</h1>

      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => router.back()} // Go back to the previous page
      >
        Back
      </button>

      <div className="customer-info">
        <div><strong>Name: </strong> {customer.name}</div>
        <div><strong>Email: </strong> {customer.email}</div>
        <div><strong>Phone: </strong> {customer.phone}</div>
        <div><strong>Address: </strong> {customer.address}</div>
      </div>

      <div className="buttons-container">
        <button
          className="edit-button"
          onClick={() => router.push(`/customers/${id}/edit`)}
        >
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => handleDelete(id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

