import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import './Edit.css'

export default function EditCustomerForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = id !== "new";
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      async function fetchCustomer() {
        const response = await fetch(`http://localhost:5000/customer/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCustomer(data);
        } else {
          toast.error("Failed to fetch customer details.");
        }
      }
      fetchCustomer();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    setCustomer({ ...customer, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!customer.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!customer.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!customer.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(customer.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!customer.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/customer/${id}`
      : `http://localhost:5000/customer`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        toast.success(isEditMode ? "Customer updated successfully!" : "Customer created successfully!");
        setTimeout(() => {
          router.push("/Customers");
        }, 2000);
      } else {
        throw new Error("Failed to save customer.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <>
      <div className="form-container">
        <Toaster />

        <div className="form-card">
          {/* Back Button */}
          <button
            className="back-btn"
            onClick={() => router.back()} // Navigate back to the previous page
          >
            Back
          </button>

          <h1 className="form-heading">
            {isEditMode ? "Edit Customer" : "Add Customer"}
          </h1>
          
          <form onSubmit={handleSubmit} className="form-fields">
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? "error" : ""}`}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                value={customer.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? "error" : ""}`}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                className={`input-field ${errors.phone ? "error" : ""}`}
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
            <div>
              <label className="form-label">Address</label>
              <textarea
                name="address"
                value={customer.address}
                onChange={handleChange}
                className={`textarea-field ${errors.address ? "error" : ""}`}
              />
              {errors.address && <p className="error-message">{errors.address}</p>}
            </div>
            <button
              type="submit"
              className="submit-btn"
            >
              {isEditMode ? "Update Customer" : "Create Customer"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

