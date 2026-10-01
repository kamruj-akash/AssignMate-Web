import envConfig from "@/config/envConfig";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={envConfig.GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
