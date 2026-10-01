import { MainProvider } from "@/domain/context/main/main-provider";
import { ThemeProvider } from "@/domain/context/theme/theme-provider";
import { WalletProvider } from "@/domain/context/wallet/wallet-provider";
import MasterLayout from "@/infrastructure/app-layout/MasterLayout";
import { QueryProvider } from "@/infrastructure/app-providers/3rd-providers/QueryProvider";
import i18n from "@/locales";
import Routers from "@/routes/Routers";
import { Provider as JotaiProvider } from "jotai";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const AppProvider = () => {
  return (
    <QueryProvider>
      <JotaiProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <MainProvider>
                <WalletProvider>
                  <MasterLayout>
                    <Routers />
                  </MasterLayout>
                </WalletProvider>
              </MainProvider>
            </ThemeProvider>
          </I18nextProvider>
        </BrowserRouter>
      </JotaiProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  );
};

export default AppProvider;
