import { api } from "@/lib/api";
import { getCsrfToken } from "@/lib/sanctum";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_REVERB_APP_KEY!, {
  cluster: process.env.NEXT_PUBLIC_REVERB_CLUSTER ?? "mt1",
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
  wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
  wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
  authEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL}/broadcasting/auth`,
  authorizer: (channel: any) => {
    async function authorize(socketId: any, callback: any) {
      try {
        const response = await api.post("/broadcasting/auth", {
          socket_id: socketId,
          channel_name: channel.name,
        });
        callback(false, response.data);
      } catch (error: any) {
        console.error("Broadcast auth error:", error);
        callback(true, error);
      }
    }

    return {
      authorize,
    };
  },
  disableStats: true,
});

const echo = new Echo({
  broadcaster: "reverb",
  client: pusherClient,
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
});

export default echo;
