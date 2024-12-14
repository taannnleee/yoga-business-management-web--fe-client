import { Provider } from 'react-redux';
import store from '@/redux/store'; // Import your store
import '../globals.css'; // Your global styles

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <Provider store={store}>
        <html lang="en">
        <body>{children}</body>
        </html>
      </Provider>
  );
}
