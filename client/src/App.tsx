import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { routes } from "./routes";
import { Toaster } from "react-hot-toast";
import { Container } from "./components/Container/Container";
import { Suspense } from "react";
import "./index.css";

function App() {
  return (
    <div className="app">
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <div className="main">
        <Container>
          <Suspense>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default App;
