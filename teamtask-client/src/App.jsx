import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import Header from "./components/Header";

import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeContext.jsx";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Header />
                    <AppRouter />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
