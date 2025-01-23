import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setCustomers, deleteCustomer } from "./slice/customerSlice";
import toast, { Toaster } from "react-hot-toast"; // Import the toast package
import './Customers.css'; // Import custom CSS

export default function Customers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      async function fetchCustomers() {
        const response = await fetch("http://localhost:5000/customer");
        const data = await response.json();
        dispatch(setCustomers(data));
        setFilteredCustomers(data);
      }
      fetchCustomers();
    }
  }, [status, dispatch]);

  // Debounce effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Delay of 300ms

    return () => {
      clearTimeout(handler); // Cleanup timeout on every new keystroke
    };
  }, [searchTerm]);

  // Update filtered customers based on debounced search term
  useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [debouncedSearchTerm, customers]);

  const handleDelete = async (id) => {
    const confirmDelete = true;
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/customer/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          dispatch(deleteCustomer(id));
          toast.success("Customer deleted successfully!"); // Success toast
        } else {
          throw new Error("Failed to delete customer.");
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong."); // Error toast
      }
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="customer-container">
      <Toaster />
      <h1 className="customer-heading">Customer List</h1>
      <input
        type="text"
        placeholder="Search customers by name"
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button
        className="add-button"
        onClick={() => router.push("/customers/new/edit")}
      >
        Add New Customer
      </button>

      <table className="customer-table">
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Phone</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td className="table-cell">{customer.name}</td>
              <td className="table-cell">{customer.email}</td>
              <td className="table-cell">{customer.phone}</td>
              <td className="table-cell">
                <button
                  className="view-button"
                  onClick={() => router.push(`/customers/${customer.id}`)}
                >
                  View
                </button>
                <button
                  className="edit-button"
                  onClick={() => router.push(`/customers/${customer.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
