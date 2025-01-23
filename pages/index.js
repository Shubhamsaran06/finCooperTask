import Link from "next/link";
import './Home.css'; // Import the custom CSS file

export default function Home() {
  return (
    <div className="home-container">
      <div className="card">
        <h1 className="heading">Welcome to the Customer Manager</h1>
        <p className="description">
          Easily manage your customers, add new ones, and update their details with this intuitive dashboard.
        </p>
        <Link href="/login">
          <button className="btn">Go to Customers</button>
        </Link>
      </div>
    </div>
  );
}




