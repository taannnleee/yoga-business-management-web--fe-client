// src/components/layout/RootLayoutClient.tsx

"use client"; // Chỉ định đây là một client-side component

import { Provider } from "react-redux";
import store from "@/redux/store"; // Import Redux store
import { ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import theme from "@/theme";
import HeaderSwitcher from "@/components/organisms/HeaderFooterSwitch"; // Import HeaderSwitcher
import { ToastProvider } from "@/hooks/useToast";
import Footer from "@/components/molecules/Footer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

const RootLayoutClient = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider theme={theme}>
            <AppRouterCacheProvider>
                <CssBaseline />
                <Provider store={store}> {/* Wrap Redux store here */}
                    <ToastProvider>
                    <HeaderSwitcher /> {/* Your header component */}

                        <div style={{ minHeight: "70vh", backgroundColor: "white" }}>
                            {children} {/* Render the page content */}
                        </div>
                    </ToastProvider>
                    <Footer />
                </Provider>
            </AppRouterCacheProvider>
        </ThemeProvider>
    );
};

export default RootLayoutClient;
