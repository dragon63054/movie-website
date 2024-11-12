import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard, { loader } from "./pages/dashboard.tsx";
import MovieDetails from "./pages/viewpage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    loader: loader 
  },
  {
    path:"/movie/:id",
    element:<MovieDetails />
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);